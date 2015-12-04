[CmdletBinding(DefaultParameterSetName = 'None')]
param (
    [String] [Parameter(Mandatory = $true)]
    $ConnectedServiceName,

    [String] [Parameter(Mandatory = $true)]
    $WebSiteName,
    
    [String] [Parameter(Mandatory = $false)]
    $WebSiteLocation,
    
    [String] [Parameter(Mandatory = $false)]
    $Slot,
    
    [String] [Parameter(Mandatory = $true)]
    $PackagePath,
    
    [String] [Parameter(Mandatory = $true)]
    $TokenRegex
)

# Import the Task.Common dll that has all the cmdlets we need for Build
import-module "Microsoft.TeamFoundation.DistributedTask.Task.Common"

function Get-SingleFile($files, $pattern) {
    if ($files -is [system.array]) {
        throw (Get-LocalizedString -Key "Found more than one file to deploy with search pattern {0}. There can be only one." -ArgumentList $pattern)
    } else {
        if (!$files) {
            throw (Get-LocalizedString -Key "No files were found to deploy with search pattern {0}" -ArgumentList $pattern)
        }
        return $files
    }
}

function Replace-Tokens {
    param (
        [Parameter(Mandatory = $true)]
        [String]$setParametersFile,
        
        [Parameter(Mandatory = $true)]
        [String]$tokenRegex
    )
    
    Write-Host "Replacing tokens with environment values"
    
    ### substitute the env vars into SetParameters file
    $vars = gci -path env:*
    
    # read in the setParameters file
    $contents = gc -Path $setParametersFile
    
    # perform a regex replacement
    $newContents = "";
    $contents | % {
        $line = $_
        if ($_ -match $tokenRegex) {
            $setting = gci -path env:* | ? { $_.Name -eq $Matches[1]  }
            if ($setting) {
                Write-Host ("Replacing key {0} with value from environment" -f $setting.Name)
                $line = $_ -replace $tokenRegex, $setting.Value
            }
        }
        $newContents += $line + [Environment]::NewLine
    }
    
    Write-Host "Overwriting SetParameters file with new values"
    sc $setParametersFile -Value $newContents
}

Write-Verbose "Entering script Invoke-AzureWebDeployment.ps1"

Write-Host "ConnectedServiceName= $ConnectedServiceName"
Write-Host "WebSiteName= $WebSiteName"
Write-Host "WebSiteLocation= $WebSiteLocation"
Write-Host "PackagePath= $PackagePath"
Write-Host "PackagePath= $SetParametersFilePath"
Write-Host "PackagePath= $CmdFilePath"
Write-Host "Slot= $Slot"

### find the package, setParameters and cmd files
import-module "Microsoft.TeamFoundation.DistributedTask.Task.Common"

$packageFile = Find-Files -SearchPattern "*.zip" -RootFolder $PackagePath
$packageFile = Get-SingleFile $packageFile "*.zip"
Write-Host "packageFile= $packageFile"

$cmdFile = Find-Files -SearchPattern "*.cmd" -RootFolder $PackagePath
$cmdFile = Get-SingleFile $cmdFile "*.cmd"
Write-Host "cmdFile= $cmdFile"

$setParamsFile = Find-Files -SearchPattern "*.SetParameters.xml" -RootFolder $PackagePath
$setParamsFile = Get-SingleFile $setParamsFile "*.SetParameters.xml"
Write-Host "setParamsFile= $setParamsFile"

# get the azure website username/password and site name
Write-Host "siteObj= Get-AzureWebsite -Name $WebSiteName [-Slot $Slot]"
if ($Slot) {
    $azureMachine = "https://{0}-{1}.scm.azurewebsites.net:443/msdeploy.axd" -f $WebSiteName, $Slot
    $siteObj = Get-AzureWebsite -Name $WebSiteName -Slot $Slot
    $iisSiteName = "{0}__{1}" -f $WebSiteName, $Slot
} else {
    $azureMachine = "https://{0}.scm.azurewebsites.net:443/msdeploy.axd" -f $WebSiteName
    $siteObj = Get-AzureWebsite -Name $WebSiteName
    $iisSiteName = $WebSiteName
}
Write-Host "azureMachine= $azureMachine"
Write-Host "iisSiteName= $iisSiteName"

# override the IIS Site name parameter
Write-Host "Setting IIS Web Application Name in SetParams file" 
$paramXml = [xml](gc $setParamsFile)
$siteParam = $paramXml.parameters.setParameter | ? { $_.name -eq "IIS Web Application Name" }
$siteParam.value = $iisSiteName
$paramXml.Save($setParamsFile)

### build the Azure command args
$cmdArgs = "/Y `"/M:{0}`" `"/u:{1}`" `"/p:{2}`" /a:Basic" -f $azureMachine, $siteObj.PublishingUsername, $siteObj.PublishingPassword

Write-Host "cmd /c $cmdFile $cmdArgs"
cmd /c "$cmdFile $cmdArgs"

Write-Verbose -Verbose "Leaving script Invoke-WebDeployment.ps1"