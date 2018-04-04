[CmdletBinding()]
param()

Trace-VstsEnteringInvocation $MyInvocation

# load dependent script
. "$PSScriptRoot\FindSqlPackagePath.ps1"

$extraArgs = Get-VstsInput -Name "extraArgs"
$reverse = Get-VstsInput -Name "reverse"
$source = Get-VstsInput -Name "sourceDacpac"
$target = Get-VstsInput -Name "targetDacpac"

function Invoke-Command {
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

function New-Report {
    param(
        [string]$SqlPackagePath,
        [string]$SourceDacpac,
        [string]$TargetDacpac,
        [string]$ExtraArgs
    )

    Write-Verbose "Generating report: source = $SourceDacpac, target = $TargetDacpac"
    $commandArgs = "/a:{0} /sf:`"$SourceDacpac`" /tf:`"$TargetDacpac`" /tdn:Test /op:`"{1}`" {2}"

    if (-not (Test-Path -Path "./SchemaCompare")) {
        mkdir "SchemaCompare"
    }

    $reportArgs = $commandArgs -f "DeployReport", "./SchemaCompare/SchemaCompare.xml", $ExtraArgs
    $reportCommand = "`"$SqlPackagePath`" $reportArgs"
    $reportCommand
    Invoke-Command -command $reportCommand

    #$scriptArgs = $commandArgs -f "Script", "./SchemaCompare/ChangeScript.sql", $ExtraArgs
    #$scriptCommand = "`"$SqlPackagePath`" $scriptArgs"
    #$scriptCommand
    #Invoke-Command -command $scriptCommand
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
}

#
# Main script
#
$SqlPackagePath = Get-SqlPackageOnTargetMachine
Write-Verbose -Verbose "Using sqlPackage path $SqlPackagePath"

$rootUri = "$($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI)$env:SYSTEM_TEAMPROJECTID/_apis"

$headers = @{Authorization = "Bearer $env:SYSTEM_ACCESSTOKEN"}
if (-not($env:SYSTEM_ACCESSTOKEN) -or $env:SYSTEM_ACCESSTOKEN -eq '') {
    Write-Error "Could not find token for autheniticating. Please enable OAuth token in Build/Release Options"
    throw
}

$continue = $TRUE

    if (!(Test-Path $source)) {
		Write-Error "$source not found!"
		$continue = $FALSE
	}
	
	if (!(Test-Path $target)) {
		Write-Error "$target not found!"
		$continue = $FALSE
	}
        if ($continue -eq $TRUE) {
            if ($reverse -eq "true") {			
                New-Report -SqlPackagePath $SqlPackagePath -SourceDacpac $target -TargetDacpac $source -ExtraArgs $extraArgs
            } else {
                New-Report -SqlPackagePath $SqlPackagePath -SourceDacpac $source -TargetDacpac $target -ExtraArgs $extraArgs
            }

            #$reportPath = ".\SchemaCompare\SchemaCompare.xml"
            Convert-Report

            # upload the schema report files as artifacts
            Write-Verbose -Verbose "Uploading report"
            $schemaComparePath = Resolve-Path ".\SchemaCompare"
            
            # Add the summary sections
            Write-VstsAddAttachment -Type "Distributedtask.Core.Summary" -Name "Schema Change Summary" -Path "$schemaComparePath\deploymentReport.md"
            #Write-VstsAddAttachment -Type "Distributedtask.Core.Summary" -Name "Change Script" -Path "$schemaComparePath\changeScript.md"
        }

Trace-VstsLeavingInvocation $MyInvocation