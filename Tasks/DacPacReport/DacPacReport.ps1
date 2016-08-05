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
    Write-Host $build

    if ($build.count -ne 1) {
        Write-VstsTaskWarning -Message "There appears to be no successful build to compare."
        $null
    } else {
        Write-VstsTaskDebug -Message "Found build $($build.value[0].buildNumber) for compare"
        $build.value[0]
    }
}
 
function Find-File {
    param(
        [string]$Path,
        [string]$FilePattern
    )

    Write-VstsTaskVerbose -Message "Searching for $FilePattern in $Path"
    $files = Find-VstsFiles -LiteralDirectory $Path -LegacyPattern $FilePattern

    if ($files -eq $null -or $files.GetType().Name -ne "String") {
        $count = 0
        if ($files -ne $null) {
            $count = $files.length
        }
        Write-VstsTaskWarning -Message "Found $count matching files in folder. Expected a single file."
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
        Write-VstsTaskWarning -Message "There is no drop with the name $DropName."
        ""
    } else {
        Write-VstsTaskDebug -Message "Downloading drop $($drop.resource.downloadUrl)"
        wget -Uri $drop.resource.downloadUrl -Headers $Headers -OutFile "$DropName.zip"
        Expand-Archive -Path "$DropName.zip" -DestinationPath ".\sourceDrop" -Force
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

function Convert-ReportToHtml {
    param(
        [string]$ReportPath = "./SchemaCompare/SchemaCompare.xml"
    )

    Write-Verbose "Converting report $reportPath to HTML"
    $xslXml = [xml](gc ".\report-transform.xslt")
    $reportXml = [xml](gc $reportPath)

    $xslt = New-Object System.Xml.Xsl.XslCompiledTransform
    $xslt.Load($xslXml)
    $stream = New-Object System.IO.MemoryStream
    $xslt.Transform($reportXml, $null, $stream)
    $stream.Position = 0
    $reader = New-Object System.IO.StreamReader($stream)
    $html = $reader.ReadToEnd()

    Write-Verbose "Writing out transformed report to deploymentReport.html"
    sc -Path "SchemaCompare\deploymentReport.html" -Value $html
}

#
# Main script
#
$SqlPackagePath = Get-SqlPackageOnTargetMachine
Write-VstsTaskDebug -Message "Using sqlPackage path $SqlPackagePath"

$rootUri = "$($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI)$env:SYSTEM_TEAMPROJECTID/_apis"

# just for testing
$headers = @{Authorization = "Basic $env:SYSTEM_ACCESSTOKEN"}
# for reals
#$headers = @{Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"}

$compareBuild = Get-LatestBuild -RootUri $rootUri -Headers $headers
if ($compareBuild -ne $null) {
    $sourceDacpac = Download-BuildDrop -RootUri $rootUri -Headers $headers -BuildId $compareBuild.id -DropName $dropName -DacpacName $dacpacName
    if ($sourceDacpac -ne $null) {
        Write-VstsTaskDebug -Message "Found source dacpac $($sourceDacpac)"

        $targetDacpac = Find-File -Path $targetDacpacPath -FilePattern "$dacpacName.dacpac"
        if ($targetDacpac -ne $null) {
            Write-VstsTaskDebug -Message "Found target dacpac $($targetDacpac)"

            Create-Report -SqlPackagePath $SqlPackagePath -SourceDacpac $sourceDacpac -TargetDacpac $targetDacpac

            $reportPath = "./SchemaCompare/SchemaCompare.xml"
            Convert-ReportToHtml

            # upload the schema report files as artifacts
            $schemaComparePath = Resolve-Path "./SchemaCompare" 
            Write-VstsUploadArtifact -ContainerFolder "SchemaCompare" -Name "SchemaCompare" -Path "$schemaComparePath\*.*"
        }
    }
}


Trace-VstsLeavingInvocation $MyInvocation