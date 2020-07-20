[CmdletBinding()]
param()

Trace-VstsEnteringInvocation $MyInvocation

# load dependent script
. "$PSScriptRoot\FindSqlPackagePath.ps1"

$dropName = Get-VstsInput -Name "dropName" -Require
$targetDacpacPath = Get-VstsInput -Name "targetDacpacPath" -Require
$dacpacName = Get-VstsInput -Name "dacpacName" -Require
$extraArgs = Get-VstsInput -Name "extraArgs"
$reverse = Get-VstsInput -Name "reverse"
$userSqlPackagePath = Get-VstsInput -Name "userSqlPackagePath"
$database = Get-VstsInput -Name "database"

Write-Debug "DropName is $dropName"
Write-Debug "$userSqlPackagePath"

function Get-ConnectionString
{
    $serverName= Get-VstsInput -Name "servername"
    $integratedSecurity= Get-VstsInput -Name "integratedsecurity"
    $databaseName=Get-VstsInput -Name "databasename"

    $connectionstring="Server=$serverName;Database=$databaseName;"

    Write-Host "Integrated Security: $integratedSecurity"
    Write-Host "Variable type: $($integratedSecurity.GetType())"
    if (($null -ne ($integratedSecurity)) -and ($integratedSecurity -eq $true))
    {
        Write-Host "Building integrated security string"
        $connectionstring=$connectionstring + "Integrated Security=SSPI"
    }
    else
    {
        Write-Host "Building user name/password string"
        $username=Get-VstsInput -name "username"
        $password=Get-VstsInput -name "password"

        $connectionstring=$connectionstring + "UID=$username;PWD=$password";
    }
    return $connectionstring;
}

function Get-Input{
    param ([string]$name,
    [boolean]$require)
    
        if ($require)
        {
            $result=(Get-VstsInput -Name $name -Require)
        }
        else
        {
            $result=(Get-VstsInput -Name $name)
        }
        return $result    
}

function Get-NotParametersStatement
{
    Write-Host "Building Not drop parameters"
    $parameters=Get-NotParameters
    $result=""    
    $obj=ConvertFrom-Json $parameters
    $obj | Get-Member -MemberType NoteProperty | ForEach-Object {
        $key=$_.Name
        if ($obj."$key")
        {
            $result= $result + "$key;"
        }        
    }
    $result=" /p:DoNotDropObjectTypes=$result"
    return $result;
}

function Get-NotParameters
{
    $notdrop = @"
    {
    "ApplicationRoles": $(Get-Input -name "notapplicationroles"),
    "DatabaseRoles": $(Get-Input -name "notdatabaseroles"),
    "Defaults": $(Get-Input -name "notdefaults"),
    "Logins": $(Get-Input -name "notlogins"),
    "ServerRoleMembership": $(Get-Input -name "notserverrolemembership"),
    "Users": $(Get-Input -name "notusers")
    }
"@

    return $notdrop;
}

function Get-IgnoreParameters
{
    $ignore = @"
    {
    "IgnorePermissions": $(Get-Input -name "ignorepermissions"),
    "IgnoreRoleMembership": $(Get-Input -name "ignorerolemembership"),
    "IgnoreAuthorizer": $(Get-Input -name "ignoreauthorizer")
    }
"@
    return $ignore;
}

function Get-AdditionalParameters
{
    $ignore=Get-IgnoreParametersStatement
    $notdrop=Get-NotParametersStatement
    $result=$ignore + $notdrop
    return $result
}

function Get-IgnoreParametersStatement
{
    Write-Host "Building Ignore Parameters"
    $parameters=Get-IgnoreParameters
    $result=""
    Write-Host "Ignore Parameters: $parameters"
    Write-Host "Converting to JSON"
    $obj=ConvertFrom-Json $parameters
    $obj | Get-Member -MemberType NoteProperty | ForEach-Object {
        $key=$_.Name
        if ($obj."$key")
        {
            $result= $result + " /p:$key=True"
        }        
    }
    return $result;
}


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
 
function xFind-File {
    param(
        [string]$Path,
        [string]$FilePattern
    )

    Write-Verbose -Verbose "Searching for $FilePattern in $Path"
    $files = Find-VstsFiles -LiteralDirectory $Path -LegacyPattern $FilePattern

    if ($null -eq $files -or $files.GetType().Name -ne "String") {
        $count = 0
        if ($null -eq $files) {
            $count = $files.length
        }
        Write-Warning "Found $count matching files in folder. Expected a single file."
        $null
    } else {
        return $files
    }
}

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

function Get-BuildDrop {
    param(
        [string]$RootUri,
        $Headers,
        [string]$BuildId,
        [string]$DropName,
        [string]$DacpacName
    )

    $uri = "$($RootUri)/build/builds/$BuildId/artifacts"
    $artifacts = Invoke-RestMethod -Uri $uri -Headers $Headers
    $drop = $artifacts.value | Where-Object { $_.name.ToUpperInvariant() -eq $DropName.ToUpperInvariant() }
    if ($null -eq $drop) {
        Write-Warning "There is no drop with the name $DropName."
        ""
    } else {
        $tPath = "sourceDrop"

        # the drop is a file share
        if ($drop.resource.downloadUrl.StartsWith('file')) {
            if (Test-Path -Path $tPath) {
                Remove-Item -Path $tPath -Recurse -Force
            }
            mkdir $tPath
            $tPath = Resolve-Path $tPath

            $uncPath = [System.Uri]($drop.resource.downloadUrl)
            Write-Verbose -Verbose "Copying drop from server share $uncPath"
            Copy-Item -Path $uncPath.LocalPath -Destination $tPath -Recurse -Force
        } else {
            # the drop is a server drop
            Write-Verbose -Verbose "Downloading drop $($drop.resource.downloadUrl)"
            Invoke-WebRequest -Uri $drop.resource.downloadUrl -Headers $Headers -OutFile "$DropName.zip"

            # extract the zip file
            if (Get-Command "Expand-Archive" -ErrorAction SilentlyContinue) {
                Expand-Archive -Path "$DropName.zip" -DestinationPath ".\$tPath" -Force
                $tPath = Resolve-Path $tPath
            } else {
                Write-Verbose -Verbose "Expand-Archive does not exist. Using System.IO.Compression.ZipFile"
                
                $zipPath = Resolve-Path ".\$DropName.zip"
                $tPath = "SourceDrop"

                if (Test-Path -Path $tPath) {
                    Remove-Item -Path $tPath -Recurse -Force
                }
                mkdir $tPath
                $tPath = Resolve-Path $tPath
                
                Add-Type -AssemblyName "System.IO.Compression.FileSystem"
                [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $tPath)
            }
        }

        $tfile = Find-VstsMatch -DefaultRoot $tPath -Pattern "**\$DacpacName.dacpac"
        if (-not ($tfile)) {
            Write-Warning "Could not find dacpac in build drop matching pattern '**\$DacpacName.dacpac'"
            throw
        }
        return $tFile
    }
}

function New-Report {
    param(
        [string]$SlPackagePath,
        [string]$SourceDacpac,
        [string]$TargetDacpac,
        [string]$ReportPath,
        [string]$ExtraArgs
    )

    if (($null -eq $SourceDacpac) -or ($null -eq $TargetDacpac))
    {
        $tdn=" /tdn:Test"
    }
    else
    {
        $tdn=""
    }

    if (($null -ne $SourceDacpac) -and ($SourceDacpac -ne ""))
    {
        $SourceDacpac = Resolve-Path -Path $SourceDacpac
        $SourceArgs=" /sf:`"$SourceDacpac`""
    }
    else
    {
        $SourceDacpac=$extraArgs;
        $SourceArgs=""
    }
    if (($null -ne $TargetDacpac) -and ($TargetDacpac -ne ""))
    {
        $TargetDacpac = Resolve-Path -Path $TargetDacpac
        $TargetArgs=" /tf:`"$TargetDacpac`""
    }
    else
    {
        $TargetDacpac=$ExtraArgs
        $TargetArgs=""
    }

    Write-Verbose "Generating report: source = $SourceDacpac, target = $TargetDacpac"
    $commandArgs = "/a:{0} $SourceArgs $TargetArgs $tdn /op:`"{1}`" {2}"

    if (-not (Test-Path -Path "$ReportPath/SchemaCompare")) {
        mkdir "$ReportPath/SchemaCompare"
    }

    $reportArgs = $commandArgs -f "DeployReport", "$ReportPath/SchemaCompare/SchemaCompare.xml", $ExtraArgs
    $reportCommand = "`"$SqlPackagePath`" $reportArgs"
    $reportCommand
    Invoke-Command -command $reportCommand

    $scriptArgs = $commandArgs -f "Script", "$ReportPath/SchemaCompare/ChangeScript.sql", $ExtraArgs
    $scriptCommand = "`"$SqlPackagePath`" $scriptArgs"
    $scriptCommand
    Invoke-Command -command $scriptCommand
}

function Convert-Report {
    param(
        [string]$ReportPath = ".\SchemaCompare",
        [string]$reportName = "SchemaCompare.xml"
    )

    Write-Verbose -Verbose "Converting report $reportPath to md"
    $xslXml = [xml](Get-Content ".\report-transformToMd.xslt")
    $reportXml = [xml](Get-Content "$reportPath\$reportName")

    $xslt = New-Object System.Xml.Xsl.XslCompiledTransform
    $xslt.Load($xslXml)
    $stream = New-Object System.IO.MemoryStream
    $xslt.Transform($reportXml, $null, $stream)
    $stream.Position = 0
    $reader = New-Object System.IO.StreamReader($stream)
    $text = $reader.ReadToEnd()

    Write-Verbose -Verbose "Writing out transformed report to deploymentReport.md"
    Set-Content -Path "$reportPath\deploymentReport.md" -Value $text

    # make an md file out of the sql script

    $mdTemplate = @"
**Note**: Even if there are no schema changes, this script would still be run against the target environment. This usually includes
some housekeeping code and any pre- and post-deployment scripts you may have in your database model.

``````
{0}
``````
"@
    $md = $mdTemplate -f (Get-Content "$reportPath\ChangeScript.sql" -Raw)
    Set-Content -Path "$reportPath\ChangeScript.md" -Value $md
}

try {
#
# Main script
#
    $hardCodedArgs=" /p:DropObjectsNotInSource=True /p:BlockOnPossibleDataLoss=True /p:DisableAndReenableDdlTriggers=True /p:DropStatisticsNotInSource=False /p:IncludeTransactionalScripts=True /p:ScriptDatabaseOptions=False"

    try {
        if ($null -eq $userSqlPackagePath -or $userSqlPackagePath -eq "") {
            $SqlPackagePath = Get-SqlPackageOnTargetMachine
        } else { 
            $SqlPackagePath = $userSqlPackagePath
        }
    } catch {
        Write-Warning "Could not find SQL Package path: $_"
        throw
    }
    Write-Verbose -Verbose "Using sqlPackage path $SqlPackagePath"

    $rootUri = "$($env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI)$env:SYSTEM_TEAMPROJECTID/_apis"

    Write-Host "Attempting to get System.AccessToken"
    $token = Get-VstsTaskVariable -Name "System.AccessToken"
    if (-not($token) -or $token -eq '') {
        Write-Error "Could not find token for autheniticating. Please enable OAuth token in Build/Release Options"
        throw
    } else {
        Write-Host "Successfully obtained System.AccessToken"
        $headers = @{Authorization = "Bearer $token"}
    }
    Write-Host "Moving Forward..."
    # just for testing
    if (-not ($env:TF_BUILD)) {
        Write-Verbose -Verbose "*** NOT RUNNING IN A BUILD ***"
        $headers = @{Authorization = "Basic $env:SYSTEM_ACCESSTOKEN"}
    }

    if (-not ($database))
    {
        Write-Host "Not a database comparison"
        $compareBuild = Get-LatestBuild -RootUri $rootUri -Headers $headers
        if ($null -eq $compareBuild) {
            $sourceDacpac = Get-BuildDrop -RootUri $rootUri -Headers $headers -BuildId $compareBuild.id -DropName $dropName -DacpacName $dacpacName


            # hack: when using unzip, the Get-BuildDrop return is an array [not sure why]
            if ($sourceDacpac.GetType().Name -ne "String") {
                $sourceDacpac = $sourceDacpac[1]
            }

            if ($null -eq $sourceDacpac) {
                Write-Verbose -Verbose "Found source dacpac $sourceDacpac"
            }
        }
    }
    else {
        $hardCodedArgs=$hardCodedArgs + " /tcs:" + "`"" + (Get-ConnectionString) + "`""
    }
    Write-Host "Searching the Target Dacpac at $targetDacpacPath"    
    $targetDacpac = xFind-File -Path $targetDacpacPath -FilePattern "$dacpacName.dacpac"
    if ($null -ne $targetDacpac) {
        Write-Verbose -Verbose "Found target dacpac $($targetDacpac)"
    }
    $additionalParameters=Get-AdditionalParameters
    $extraArgs=$extraArgs + $hardCodedArgs + $additionalParameters
    if (-not ($database))
    {
        Write-Host "Not a database comparison"
        if ($reverse -eq $true) {
            Write-Verbose "Using 'reverse' logic since reverse was set to true"
            New-Report -SqlPackagePath $SqlPackagePath -SourceDacpac $targetDacpac -TargetDacpac $sourceDacpac -ExtraArgs $extraArgs -ReportPath $targetDacpacPath
        } 
        else {
                    Write-Verbose "Using original logic since reverse was set to false"
                    New-Report -SqlPackagePath $SqlPackagePath -SourceDacpac $sourceDacpac -TargetDacpac $targetDacpac -ExtraArgs $extraArgs -ReportPath $targetDacpacPath
            }
    }
    else
    {
        Write-Host "Database Comparison"
        if ($reverse -eq $true) {
            Write-Verbose "Using 'reverse' logic since reverse was set to true"
            New-Report -SqlPackagePath $SqlPackagePath -SourceDacpac $targetDacpac -ExtraArgs $extraArgs  -ReportPath $targetDacpacPath
        } 
        else {
                Write-Verbose "Using original logic since reverse was set to false"
                New-Report -SqlPackagePath $SqlPackagePath -TargetDacpac $targetDacpac -ExtraArgs $extraArgs  -ReportPath $targetDacpacPath
            }        
    }

    $reportPath = "$targetDacpacPath\SchemaCompare"
    $reportName="\SchemaCompare.xml"
    Convert-Report -ReportPath $reportPath -ReportName $reportName

    # upload the schema report files as artifacts
    Write-Verbose -Verbose "Uploading report"
    $schemaComparePath = Resolve-Path "$targetDacpacPath\SchemaCompare"
    
    # Add the summary sections
    Write-VstsAddAttachment -Type "Distributedtask.Core.Summary" -Name "Schema Change Summary - $dacpacName.dacpac" -Path "$schemaComparePath\deploymentReport.md"
    Write-VstsAddAttachment -Type "Distributedtask.Core.Summary" -Name "Change Script - $dacpacName.dacpac" -Path "$schemaComparePath\ChangeScript.md"

} finally {
    Trace-VstsLeavingInvocation $MyInvocation
}
