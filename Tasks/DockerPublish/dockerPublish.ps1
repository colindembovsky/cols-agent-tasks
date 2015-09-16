param(
    [string]$pathToPubxml,
    [string]$pathToDockerfile,
    [string]$packOutput,
    [string]$serverUrl,
    [string]$imageName,
    [string]$hostPort,
    [string]$containerPort,
    [string]$authOptions,
    [string]$runOptions,
    [string]$appType,
    [string]$removeConflictingContainers,
    [string]$buildOnly,
    [string]$isWindowsContainer,
    [string]$isWebApp
)

function Add-Override(
    $pubProps,
    [string]$name,
    [string]$value,
    [switch]$isBool
) {
    if ($value) {
        if ($isBool){
            $value = Convert-String $value Boolean
        }
        $pubProps[$name] = $value
    }
}

Write-Verbose -Verbose "Starting Docker Publish step"

# default location for publisingcp 
$pubProps = @{}
Add-Override -pubProps $pubProps -name "DockerServerUrl" -value $serverUrl
Add-Override -pubProps $pubProps -name "DockerImageName" -value $imageName
Add-Override -pubProps $pubProps -name "DockerPublishHostPort" -value $hostPort
Add-Override -pubProps $pubProps -name "DockerPublishContainerPort" -value $containerPort
Add-Override -pubProps $pubProps -name "DockerAuthOptions" -value $authOptions
Add-Override -pubProps $pubProps -name "DockerRunOptions" -value $runOptions
Add-Override -pubProps $pubProps -name "DockerAppType" -value $appType
Add-Override -pubProps $pubProps -name "DockerBuildOnly" -value $buildOnly -isBool
Add-Override -pubProps $pubProps -name "DockerRemoveConflictingContainers" -value $removeConflictingContainers -isBool
Add-Override -pubProps $pubProps -name "CreateWindowsContainer" -value $isWindowsContainer -isBool
Add-Override -pubProps $pubProps -name "Dockerfile" -value (Split-Path -Leaf $pathToDockerfile)

# never open a browser to the publsihed container
Add-Override -pubProps $pubProps -name "LaunchSiteAfterPublish" -value "false" -isBool
    
Write-Verbose -Verbose "Overriding pubxml values:"
Write-Verbose -Verbose ($pubProps | Out-String)

Write-Verbose -Verbose "Calling dockerPublishVS script"
Write-Verbose -Verbose ".\dockerPublishVS.ps1 -publishProperties {pubProps} -packOutput $packOutput -pubxmlFile $pathToPubxml" 
& .\dockerPublishVS.ps1 -publishProperties $pubProps -packOutput $packOutput -pubxmlFile $pathToPubxml

Write-Verbose -Verbose "Leaving Docker Publish step"