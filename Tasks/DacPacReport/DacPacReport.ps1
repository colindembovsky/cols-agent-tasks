[CmdletBinding()]
param()

Trace-VstsEnteringInvocation $MyInvocation

# load dependent script
. "$PSScriptRoot\FindSqlPackagePath.ps1"

$dropName = Get-VstsInput -Name "dropName" -Require
$targetDacpacPath = Get-VstsInput -Name "targetDacpacPath" -Require
$dacpacName = Get-VstsInput -Name "dacpacName" -Require

function Get-LatestBuild {
    param(
        [string]$RootUri,
        $Headers
    )

    $uri = "$($RootUri)/build/builds?definitions=$($env:SYSTEM_DEFINITIONID)&resultFilter=succeeded&`$top=1&api-version=2.0"
    $build = Invoke-RestMethod -Uri $uri -Headers $Headers

    if ($build.count -ne 1) {
        Write-Warning "There appears to be no successful build to compare."
        $null
    } else {
        Write-Verbose -Verbose "Found build $($build.value[0]) for compare"
        $build.value[0]
    }
}
 
function Find-File {
    param(
        [string]$Path,
        [string]$FilePattern
    )

    Write-Verbose -Verbose "Searching for $FilePattern in $Path"
    $files = Find-VstsFiles -LiteralDirectory $Path -LegacyPattern $FilePattern

    if ($files -eq $null -or $files.GetType().Name -ne "String") {
        $count = 0
        if ($files -ne $null) {
            $count = $files.length
        }
        Write-Warning "Found $count matching files in folder. Expected a single file."
        $null
    } else {
        $files
    }
}

function Run-Command {
    param(
        [String][Parameter(Mandatory=$true)] $command
    )

    try
	{
        if ($psversiontable.PSVersion.Major -le 4)
        {
           cmd.exe /c "`"$command`""
        }
        else
        {
           cmd.exe /c "$command"
        }

    }
	catch [System.Exception]
    {
        Write-Verbose $_.Exception
        throw $_.Exception
    }
}

function Download-BuildDrop {
    param(
        [string]$RootUri,
        $Headers,
        [string]$BuildId,
        [string]$DropName,
        [string]$DacpacName
    )

    $uri = "$($RootUri)/build/builds/$BuildId/artifacts"
    $artifacts = Invoke-RestMethod -Uri $uri -Headers $Headers
    $drop = $artifacts.value | ? { $_.name.ToUpperInvariant() -eq $DropName.ToUpperInvariant() }
    if ($drop -eq $null) {
        Write-Warning "There is no drop with the name $DropName."
        ""
    } else {
        Write-Verbose -Verbose "Downloading drop $($drop.resource.downloadUrl)"
        wget -Uri $drop.resource.downloadUrl -Headers $Headers -OutFile "$DropName.zip"

        # extract the zip file
        if (Get-Command "Expand-Archive" -ErrorAction SilentlyContinue) {
            Expand-Archive -Path "$DropName.zip" -DestinationPath ".\sourceDrop" -Force
        } else {
            Write-Verbose -Verbose "Expand-Archive does not exist. Using System.IO.Compression.ZipFile"
            
            $zipPath = Resolve-Path ".\$DropName.zip"
            $tPath = ".\SourceDrop"

            if (Test-Path -Path $tPath) {
                Remove-Item -Path $tPath -Recurse -Force
            }
            mkdir $tPath
            Add-Type -AssemblyName "System.IO.Compression.FileSystem"
            [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $tPath)
        }
        Find-File -Path ".\sourceDrop" -FilePattern "**\$DacpacName.dacpac"
    }
}

function Create-Report {
    param(
        [string]$SlPackagePath,
        [string]$SourceDacpac,
        [string]$TargetDacpac
    )

    $SourceDacpac = Resolve-Path -Path $SourceDacpac
    $TargetDacpac = Resolve-Path -Path $TargetDacpac

    Write-Verbose "Generating report: source = $SourceDacpac, target = $TargetDacpac"
    $commandArgs = "/a:{0} /sf:`"$SourceDacpac`" /tf:`"$TargetDacpac`" /tdn:Test /op:`"{1}`""

    if (-not (Test-Path -Path "./SchemaCompare")) {
        mkdir "SchemaCompare"
    }

    $reportArgs = $commandArgs -f "DeployReport", "./SchemaCompare/SchemaCompare.xml"
    $reportCommand = "`"$SqlPackagePath`" $reportArgs"
    $reportCommand
    Run-Command -command $reportCommand

    $scriptArgs = $commandArgs -f "Script", "./SchemaCompare/ChangeScript.sql"
    $scriptCommand = "`"$SqlPackagePath`" $scriptArgs"
    $scriptCommand
    Run-Command -command $scriptCommand
}

function Convert-Report {
    param(
        [string]$ReportPath = ".\SchemaCompare\SchemaCompare.xml"
    )

    Write-Verbose -Verbose "Converting report $reportPath to md"
    $xslXml = [xml](gc ".\report-transformToMd.xslt")
    $reportXml = [xml](gc $reportPath)

    $xslt = New-Object System.Xml.Xsl.XslCompiledTransform
    $xslt.Load($xslXml)
    $stream = New-Object System.IO.MemoryStream
    $xslt.Transform($reportXml, $null, $stream)
    $stream.Position = 0
    $reader = New-Object System.IO.StreamReader($stream)
    $text = $reader.ReadToEnd()

    Write-Verbose -Verbose "Writing out transformed report to deploymentReport.md"
    sc -Path "SchemaCompare\deploymentReport.md" -Value $text

    # make an md file out of the sql script

    $mdTemplate = @"
``````
{0}
``````
"@
    $md = $mdTemplate -f (gc ".\SchemaCompare\ChangeScript.sql" -Raw)
    sc -Path "SchemaCompare\ChangeScript.md" -Value $md
}

#
# Main script
#
$SqlPackagePath = Get-SqlPackageOnTargetMachine
Write-Verbose -Verbose "Using sqlPackage path $SqlPackagePath"

$rootUri = "$($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI)$env:SYSTEM_TEAMPROJECTID/_apis"

# just for testing
$headers = @{Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"}
if (-not ($env:TF_BUILD)) {
   Write-Verbose -Verbose "*** NOT RUNNING IN A BUILD ***"
   $headers = @{Authorization = "Basic $env:SYSTEM_ACCESSTOKEN"}
}

$compareBuild = Get-LatestBuild -RootUri $rootUri -Headers $headers
if ($compareBuild -ne $null) {
    $sourceDacpac = Download-BuildDrop -RootUri $rootUri -Headers $headers -BuildId $compareBuild.id -DropName $dropName -DacpacName $dacpacName
    if ($sourceDacpac -ne $null) {
        Write-Verbose -Verbose "Found source dacpac $($sourceDacpac)"

        $targetDacpac = Find-File -Path $targetDacpacPath -FilePattern "$dacpacName.dacpac"
        if ($targetDacpac -ne $null) {
            Write-Verbose -Verbose "Found target dacpac $($targetDacpac)"

            Create-Report -SqlPackagePath $SqlPackagePath -SourceDacpac $sourceDacpac -TargetDacpac $targetDacpac

            $reportPath = ".\SchemaCompare\SchemaCompare.xml"
            Convert-Report

            # upload the schema report files as artifacts
            Write-Verbose -Verbose "Uploading report"
            $schemaComparePath = Resolve-Path ".\SchemaCompare"
            
            # Add the summary sections
            Write-VstsAddAttachment -Type "Distributedtask.Core.Summary" -Name "Schema Change Summary - $dacpacName.dacpac" -Path "$schemaComparePath\deploymentReport.md"
            Write-VstsAddAttachment -Type "Distributedtask.Core.Summary" -Name "Change Script - $dacpacName.dacpac" -Path "$schemaComparePath\ChangeScript.md"
        }
    }
}


Trace-VstsLeavingInvocation $MyInvocation