#Requires –Version 3.0

<#
.DESCRIPTION
    Publish an application to Docker container
    Please visit http://go.microsoft.com/fwlink/?LinkID=529706 to learn more about the scirpt

.EXAMPLE
    & '.\contoso-Docker-publish.ps1' -packOutput $env:USERPROFILE\AppData\Local\Temp\PublishTemp -pubxmlFile '.\contoso-Docker.pubxml'

.EXAMPLE
    $publishProperties = @{ "SiteUrlToLaunchAfterPublish"="http://contoso.cloudapp.net/Home"; }
    & '.\contoso-Docker-publish.ps1' $publishProperties $env:USERPROFILE\AppData\Local\Temp\PublishTemp '.\contoso-Docker.pubxml'
#>

[cmdletbinding(SupportsShouldProcess = $true)]
param($publishProperties, $packOutput, $pubxmlFile, $srcDir)

<#
    Core publish functions
#>

function Publish-AspNetDocker {
    [cmdletbinding(SupportsShouldProcess = $true)]
    param(
        [Parameter(Mandatory = $true, Position = 0)]
        [AllowNull()]
        $publishProperties,
        [Parameter(Mandatory = $true, Position = 1)]
        $packOutput,
        [Parameter(Mandatory = $false, Position = 2)]
        $pubxmlFile
    )
    process {

        # Merge publish properties from $publishProperties and $pubxmlFile. The value from $publishProperties will be taken if conflict.
        if ($pubxmlFile -and (Test-Path $pubxmlFile)) {
            if(!$publishProperties) {
                $publishProperties = @{}
            }
            ([xml](Get-Content $pubxmlFile)).SelectNodes(("/*/*/*")) | % { 
                if (!$publishProperties.ContainsKey($_.Name)) { $publishProperties.Add($_.Name, $_.InnerText) } 
            }
        }

        if (!$publishProperties) {
            throw 'publishProperties is empty and pubxmlFile is not valid, cannot publish'
        }

		# Trim the trailing '\' to avoid quoting issue
		$packOutput = $packOutput.TrimEnd('\')
        
		# Find the correct Dockerfile
		$dockerfile = $publishProperties["Dockerfile"]
		$dockerfilePath = (Get-ChildItem -Path $packOutput -Filter $dockerfile -Recurse | Select -First 1).FullName

		# Work around a Docker build command bug docker issue #13898
        $dockerfilePath = (gi $dockerfilePath).PSDrive.Name.ToUpper() + $dockerfilePath.SubString(1) 

        # Publish the application to a Docker container
        Publish-DockerContainerApp $publishProperties $packOutput $dockerfilePath
    }
}

function Publish-DockerContainerApp {
    [cmdletbinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0)]
        $publishProperties,
        [Parameter(Mandatory = $true, Position = 1)]
        $packOutput,
        [Parameter(Mandatory = $true, Position = 2)]
        $dockerfilePath
    )
    process {
        Ensure-DockerCommand

        $dockerServerUrl = $publishProperties["DockerServerUrl"]
        $imageName = $publishProperties["DockerImageName"]
        $hostPort = $publishProperties["DockerPublishHostPort"]
        $containerPort = $publishProperties["DockerPublishContainerPort"]
        $authOptions = $publishProperties["DockerAuthOptions"]
        $runOptions = $publishProperties["DockerRunOptions"]
        $appType = $publishProperties["DockerAppType"]
        $buildOnly = [System.Convert]::ToBoolean($publishProperties["DockerBuildOnly"])
        $removeConflictingContainers = [System.Convert]::ToBoolean($publishProperties["DockerRemoveConflictingContainers"])
        $siteUrlToLaunchAfterPublish = $publishProperties["SiteUrlToLaunchAfterPublish"]
        $launchSiteAfterPublish = [System.Convert]::ToBoolean($publishProperties["LaunchSiteAfterPublish"])
        $createWindowsContainer = [System.Convert]::ToBoolean($publishProperties["CreateWindowsContainer"])

        '==== Publish Settings ====' | Write-Verbose
        'Package output path: {0}' -f $packOutput | Write-Verbose
        'DockerHost: {0}' -f $dockerServerUrl | Write-Verbose
        'DockerImageName: {0}' -f $imageName | Write-Verbose
        if ($hostPort) { 'DockerPublishHostPort: {0}' -f $hostPort | Write-Verbose }
        if ($containerPort) { 'DockerPublishContainerPort: {0}' -f $containerPort | Write-Verbose }
        'DockerAuthOptions: {0}' -f $authOptions | Write-Verbose
        if ($authOptions) { $authOptions = " $authOptions" }
        'DockerRunOptions: {0}' -f $runOptions | Write-Verbose
        if ($runOptions) { $runOptions = " $runOptions" }
        'DockerAppType: {0}' -f $appType | Write-Verbose
        'DockerBuildOnly: {0}' -f $buildOnly | Write-Verbose
        'DockerRemoveConflictingContainers: {0}' -f $removeConflictingContainers | Write-Verbose
        'LaunchSiteAfterPublish: {0}' -f $launchSiteAfterPublish | Write-Verbose
        'SiteUrlToLaunchAfterPublish: {0}' -f $siteUrlToLaunchAfterPublish | Write-Verbose
        'CreateWindowsContainer: {0}' -f $createWindowsContainer | Write-Verbose
        'Dockerfile: {0}' -f $dockerfilePath | Write-Verbose
        '==========================' | Write-Verbose

        if ($removeConflictingContainers -and $hostPort) {

            # Remove all containers with the same port mapped to the host
            'Querying for conflicting containers which has the same port mapped to the host...' | Write-Verbose
            if ($createWindowsContainer) {
                $command = 'docker{0} -H {1} ps -a | select-string -pattern "{2}_{3}" | foreach {{ Write-Output $_.ToString().split()[0] }}' -f $authOptions, $dockerServerUrl, $hostPort, $containerPort
            }
            else {
                $command = 'docker{0} -H {1} ps -a | select-string -pattern ":{2}->" | foreach {{ Write-Output $_.ToString().split()[0] }}' -f $authOptions, $dockerServerUrl, $hostPort
            }
            $command | Print-CommandString
            $conflictingContainerIds = ($command | Execute-CommandString -useInvokeExpression)
            if ($conflictingContainerIds) {
                $conflictingContainerIds = $conflictingContainerIds -Join ' '
                'Removing conflicting containers {0}' -f $conflictingContainerIds | Write-Verbose
                $command = 'docker{0} -H {1} rm -f {2}' -f $authOptions, $dockerServerUrl, $conflictingContainerIds
                $command | Print-CommandString
                if ($createWindowsContainer) {
                    # Work around an issue that sometimes 'docker rm' cannot remove the container for the first time
                    $command | Execute-CommandString -ignoreErrors | Out-Null
                    Start-Sleep -s 3
                    $command | Execute-CommandString -ignoreErrors | Out-Null
                }
                else {
                    $command | Print-CommandString
                    $command | Execute-CommandString | Write-Verbose
                }
                'Conflicting container(s) "{0}" was removed successfully.' -f $conflictingContainerIds | Write-Output
            }
        }

        'Building Docker image: {0}' -f $imageName | Write-Verbose
        $command = 'docker{0} -H {1} build -t {2} -f "{3}" "{4}"' -f $authOptions, $dockerServerUrl, $imageName, $dockerfilePath, $packOutput
        $command | Print-CommandString
        $command | Execute-CommandString | Write-Verbose
        'The Docker image "{0}" was created successfully.' -f $imageName | Write-Output

        if (!$buildOnly) {
            $publishPort = ''
            $envVars = ''
            $containerName = ''

            if ($hostPort -and $containerPort) {
                $publishPort = ' -p {0}:{1}' -f $hostPort, $containerPort
                if ($appType -eq "Web") { $envVars = ' -e "server.urls=http://*:{0}"' -f $containerPort }
                if ($createWindowsContainer) { $containerName = ' --name {0}_{1}' -f $hostPort, $containerPort }
            }

            'Starting Docker container: {0}' -f $imageName | Write-Verbose
            $command = 'docker{0} -H {1} run -t -d{2}{3}{4}{5} {6}' -f $authOptions, $dockerServerUrl, $publishPort, $envVars, $containerName, $runOptions, $imageName
            $command | Print-CommandString
            $command | Execute-CommandString | Tee-Object -Variable containerId | Write-Verbose
            'Docker container started with ID: {0}' -f $containerId | Write-Output

            'To see standard output from your application, open a command line window and execute the following command: ' | Write-Output
            '    docker{0} -H {1} logs --follow {2}' -f $authOptions, $dockerServerUrl, $containerId | Write-Output

            if ($launchSiteAfterPublish) {

                $url = if ($siteUrlToLaunchAfterPublish) { $siteUrlToLaunchAfterPublish } elseif ($hostPort) { Get-AppWebUrl $dockerServerUrl $hostPort }

                if ($url) {
                    'Attempting to connect to {0}...' -f $url | Write-Output

                    if (!(Test-AppWebUrl -url $url)) {
                        $command = 'docker{0} -H {1} logs {2}' -f $authOptions, $dockerServerUrl, $containerId
                        $command | Print-CommandString
                        $logs = $command | Execute-CommandString
                        "Failed to connect to {0}. If your Docker host is an Azure virtual machine, please make sure to set up the endpoint '{1}' using the Azure portal.`nContainer logs:`n{2}`nPlease visit http://go.microsoft.com/fwlink/?LinkID=529706 for troubleshooting guide." -f $url, $hostPort, ($logs -Join "`n") | Write-Output
                    }

                    $command = 'Start-Process -FilePath "{0}"' -f $url
                    $command | Print-CommandString
                    $command | Execute-CommandString -useInvokeExpression -ignoreErrors
                }
            }

            'Publish completed successfully.' | Write-Output
        }
        else {
            'Publish completed successfully. The container was not started because the DockerBuildOnly flag was set to True' | Write-Output
        }
    }
}

<#
    Utility functions
#>

function Ensure-DockerCommand {
    [cmdletbinding()]
    param()
    process {
        if (! (Get-Command docker -errorAction SilentlyContinue))
        {
            $vsInstallPath = (Get-ItemProperty "HKLM:\SOFTWARE\Wow6432Node\Microsoft\VisualStudio\14.0" -Name InstallDir | select -ExpandProperty InstallDir)
            if ([string]::IsNullOrEmpty($env:ProgramW6432)) {
                $vsKeyPath = "HKLM:\SOFTWARE\Microsoft\VisualStudio\14.0"
            }
            else {
                $vsKeyPath = "HKLM:\SOFTWARE\Wow6432Node\Microsoft\VisualStudio\14.0"
            }

            $vsInstallPath = (Get-ItemProperty $vsKeyPath -Name InstallDir | select -ExpandProperty InstallDir)
            $dockerExtensionPath = Join-Path $vsInstallPath "Extensions\Microsoft\Windows Azure Tools\Docker"
            $env:Path = "$dockerExtensionPath;" + $env:Path
        }
    }
}

function Test-AppWebUrl {
    [cmdletbinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0, ValueFromPipeline = $true)]
        $url,
        [Parameter(Mandatory = $false, Position = 1)]
        [int]$attempts = 10,
        [Parameter(Mandatory = $false, Position = 2)]
        [int]$retryIntervalInSeconds = 5
    )
    process {
        $result = $false
        for ($i = 1; $i -le $attempts; $i++) {
            try {
                'Trying to connect to {0}, attempt {1}' -f $url, $i | Write-Verbose
                $response = Invoke-WebRequest -Uri $url -TimeoutSec $retryIntervalInSeconds -Headers @{"Cache-Control"="no-cache";"Pragma"="no-cache"} -UseBasicParsing
                $status = [int]$response.StatusCode
                if ($status -eq 200) {
                    $result = $true
                    break
                }
            }
            catch [System.Net.WebException] {
                'Connection failed with exception "{0}: {1}"' -f $_.Exception.Status, $_ | Write-Debug
                if ($_.Exception.Status -eq $([System.Net.WebExceptionStatus]::Timeout)) {
                    # Request timeout, no need to wait for interval again
                    continue
                }
            }
            if ($i -lt $attempts) {
                sleep $retryIntervalInSeconds
            }
        }
        $result
    }
}

function Print-CommandString {
    [cmdletbinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0, ValueFromPipeline = $true)]
        $command
    )
    process {
        'Executing command [{0}]' -f $command | Write-Output
    }
}

function Execute-CommandString {
    [cmdletbinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0, ValueFromPipeline = $true)]
        [string[]]$command,
        [switch]
        $useInvokeExpression,
        [switch]
        $ignoreErrors
    )
    process {
        foreach($cmdToExec in $command) {
            if ($useInvokeExpression) {
                try {
                    Invoke-Expression -Command $cmdToExec
                }
                catch {
                    if (-not $ignoreErrors) {
                        $msg = ('The command [{0}] exited with exception [{1}]' -f $cmdToExec, $_.ToString())
                        throw $msg
                    }
                }
            }
            else {
                cmd.exe /D /C $cmdToExec 2>&1 | Tee-Object -Variable cmdOutputs

                if (-not $ignoreErrors -and ($LASTEXITCODE -ne 0)) {
                    $msg = ('The command [{0}] exited with code [{1}]: {2}' -f $cmdToExec, $LASTEXITCODE, ($cmdOutputs -join "`n"))
                    throw $msg
                }
            }
        }
    }
}

function Get-AppWebUrl {
    [cmdletbinding()]
    param(
        [Parameter(Mandatory = $true, Position = 0, ValueFromPipeline = $true)]
        $dockerServerUrl,
        [Parameter(Position = 1)]
        $hostPort
    )
    process {
        # The input $dockerServerUrl is usually in the form of "tcp://www.contoso.com:2376" or "www.contoso.com:2376"
        # The web app URL is in the form of "http://www.contoso.com:80"
        if ($dockerServerUrl.Contains([System.Uri]::SchemeDelimiter)) {
            $uriBuilder = New-Object System.UriBuilder "$dockerServerUrl"
            $uriBuilder.Scheme = [System.Uri]::UriSchemeHttp
        }
        else {
            $uriBuilder = New-Object System.UriBuilder "$([System.Uri]::UriSchemeHttp)$([System.Uri]::SchemeDelimiter)$dockerServerUrl"
        }
        if ($hostPort) { $uriBuilder.Port = $hostPort }
        $uriBuilder.Uri.ToString()
    }
}

<#
    Script entry point
#>

try {
    # To turn on Verbose or Debug outputs, change the corresponding preference to "Continue"
    $WarningPreference = "Continue"
    $VerbosePreference = "Continue"
    $DebugPreference = "SilentlyContinue"

    # Call Publish-AspNetDocker to perform the publish operation
    Publish-AspNetDocker -publishProperties $publishProperties -packOutput $packOutput -pubxmlFile $pubxmlFile
}
catch {
    "An error occured during publish.`n{0}`nPlease visit http://go.microsoft.com/fwlink/?LinkID=529706 for troubleshooting guide." -f $_.Exception.Message | Write-Error    
}