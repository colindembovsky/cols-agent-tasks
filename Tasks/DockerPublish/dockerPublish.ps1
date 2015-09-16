Write-Verbose -Verbose "Starting Docker Publish step"

$appType = "Web"
if (!$isWebApp){
    $appType = ""
}
    
$pubProps = @{
    "DockerServerUrl": $serverUrl,
    "DockerImageName": $imageName,
    "DockerPublishHostPort": $hostPort,
    "DockerPublishContainerPort": $containerPort,
    "DockerAuthOptions": $authOptions,
    "DockerRunOptions": $runOptions,
    "DockerAppType": $appType,
    "DockerBuildOnly": $buildOnly,
    "DockerRemoveConflictingContainers": $removeConflictingContainers,
    "DockerBuildOnly": $buildOnly,
    "CreateWindowsContainer": $isWindowsContainer,
    "DockerfileRelativePath": $dockerfileRelativePath
}

Write-Verbose -Verbose "Calling dockerPublishVS script"
& .\dockerPublishVS.ps1 -publishProperties $pubProps -packOutput $env:TEMP\PublishTemp

Write-Verbose -Verbose "Leaving Docker Publish step"
