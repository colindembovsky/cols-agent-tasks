#!/bin/bash

# Publish an application to Docker container
# Please visit http://go.microsoft.com/fwlink/?LinkID=529706 to learn more about the scirpt

set -e

if ! type docker &>/dev/null; then
    echo "Unable to find docker command. Please install it first"
    exit 1
fi

if [ "$#" != "2" ]; then
    echo "Usage: $0 PubxmlFilePath PackOutputFolderPath"
    exit 1
fi

pubxmlFilePath="$1"

if [ ! -e "$pubxmlFilePath" ]; then
    echo "Unable to find publish settings xml file: $pubxmlFilePath"
    exit 1
fi

packOutputFolderPath="$2"

if [ ! -d "$packOutputFolderPath" ]; then
    echo "Unable to find pack output folder: $packOutputFolderPath"
    exit 1
fi

projectName=$(basename "$( cd -P "$(dirname "$pubxmlFilePath" )/../.." && pwd )")

publishProfilesFolderPath=$packOutputFolderPath/approot/src/$projectName/Properties/PublishProfiles

if [ ! -d "$publishProfilesFolderPath" ]; then
    echo "Unble to find publish profiles folder : $publishProfilesFolderPath."
    exit 1
fi

# Parse publish settings xml file
dockerServerUrl=$(grep -Eo '<DockerServerUrl>.+</DockerServerUrl>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerImageName=$(grep -Eo '<DockerImageName>.+</DockerImageName>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerfileRelativePath=$(grep -Eo '<DockerfileRelativePath>.+</DockerfileRelativePath>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerPublishHostPort=$(grep -Eo '<DockerPublishHostPort>.+</DockerPublishHostPort>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerPublishContainerPort=$(grep -Eo '<DockerPublishContainerPort>.+</DockerPublishContainerPort>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerAuthOptions=$(grep -Eo '<DockerAuthOptions>.+</DockerAuthOptions>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerRunOptions=$(grep -Eo '<DockerRunOptions>.+</DockerRunOptions>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerAppType=$(grep -Eo '<DockerAppType>.+</DockerAppType>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerBuildOnly=$(grep -Eo '<DockerBuildOnly>.+</DockerBuildOnly>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
dockerRemoveConflictingContainers=$(grep -Eo '<DockerRemoveConflictingContainers>.+</DockerRemoveConflictingContainers>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
siteUrlToLaunchAfterPublish=$(grep -Eo '<SiteUrlToLaunchAfterPublish>.+</SiteUrlToLaunchAfterPublish>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
launchSiteAfterPublish=$(grep -Eo '<LaunchSiteAfterPublish>.+</LaunchSiteAfterPublish>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')
createWindowsContainer=$(grep -Eo '<CreateWindowsContainer>.+</CreateWindowsContainer>' "$pubxmlFilePath" | awk -F'[<>]' '{print $3}')

echo "==== Publish Settings ===="
echo "DockerServerUrl: $dockerServerUrl"
echo "DockerImageName: $dockerImageName"
echo "DockerfileRelativePath: $dockerfileRelativePath"
echo "DockerPublishHostPort: $dockerPublishHostPort"
echo "DockerPublishContainerPort: $dockerPublishContainerPort"
echo "DockerAuthOptions: $dockerAuthOptions"
echo "DockerRunOptions: $dockerRunOptions"
echo "DockerAppType: $dockerAppType"
echo "DockerBuildOnly: $dockerBuildOnly"
echo "DockerRemoveConflictingContainers: $dockerRemoveConflictingContainers"
echo "SiteUrlToLaunchAfterPublish: $siteUrlToLaunchAfterPublish"
echo "LaunchSiteAfterPublish: $launchSiteAfterPublish"
echo "CreateWindowsContainer: $createWindowsContainer"
echo "=========================="

echo "Creating Dockerfile..."

if [ "$dockerfileRelativePath" == "" ]; then
    dockerfilePath=$publishProfilesFolderPath/Dockerfile
else
    dockerfilePath=$publishProfilesFolderPath/${dockerfileRelativePath//\\/\/}
fi

if [ ! -e "$dockerfilePath" ]; then
    echo "Unble to find DockerFile : $dockerFilePath"
    exit 1
fi

if [ "$dockerRemoveConflictingContainers" == "True" ] && [ $dockerPublishHostPort ]; then
    echo "Docker command: docker $dockerAuthOptions -H $dockerServerUrl ps -a"
    if [ "$createWindowsContainer" == "True" ]; then
        conflictingContainers=$(docker "$dockerAuthOptions" -H "$dockerServerUrl" ps -a | grep "$dockerPublishHostPort_$dockerPublishContainerPort" | awk '{print $1}')
    else
        conflictingContainers=$(docker "$dockerAuthOptions" -H "$dockerServerUrl" ps -a | grep ":$dockerPublishHostPort->" | awk '{print $1}')
    fi

    if [ $conflictingContainers ]; then
        echo "Removing conflicting containers: $conflictingContainers"
        echo "Docker command: docker $dockerAuthOptions -H $dockerServerUrl rm -f $conflictingContainers"
        if [ "$createWindowsContainer" == "True" ]; then
            docker "$dockerAuthOptions" -H "$dockerServerUrl" rm -f "$conflictingContainers" || true
            sleep 3
            docker "$dockerAuthOptions" -H "$dockerServerUrl" rm -f "$conflictingContainers" || true
        else
            docker "$dockerAuthOptions" -H "$dockerServerUrl" rm -f "$conflictingContainers"
        fi
    fi
fi

echo "Building docker image $dockerImageName..."
echo "Docker command: docker $dockerAuthOptions -H $dockerServerUrl build -t $dockerImageName -f $dockerfilePath $packOutputFolderPath"
docker "$dockerAuthOptions" -H "$dockerServerUrl" build -t "$dockerImageName" -f "$dockerfilePath" "$packOutputFolderPath"

if [ "$dockerBuildOnly" == "False" ]; then
    echo "Starting docker container: $dockerImageName..."

    publishPort=""
    envVars=""
    containerName=""

    if [ $dockerPublishHostPort ] && [ $dockerPublishContainerPort ]; then
        publishPort=" -p $dockerPublishHostPort:$dockerPublishContainerPort"
        if [ "$dockerAppType" == "Web" ]; then 
            envVars=" -e server.urls=http://*:$dockerPublishContainerPort"
        fi
        if [ "$createWindowsContainer" == "True" ]; then 
            containerName=" --name $dockerPublishHostPort_$dockerPublishContainerPort
        fi
    fi

    echo "Docker command: docker $dockerAuthOptions -H $dockerServerUrl run -t -d$publishPort$envVars $dockerRunOptions $dockerImageName"
    containerId=$(docker "$dockerAuthOptions" -H "$dockerServerUrl" run -t -d$publishPort$envVars$containerName $dockerRunOptions "$dockerImageName")
    echo "New container started with id: $containerId"

    echo -e "To see standard output from your application, execute the command:\ndocker $dockerAuthOptions -H $dockerServerUrl logs --follow $containerId"
    echo "Publish completed successfully."

    if [ "$launchSiteAfterPublish" == "True" ]; then
        if [ "$siteUrlToLaunchAfterPublish" == "" ]; then
            url="http://"$(expr "$dockerServerUrl" : '.*//\(.*\:\)')$dockerPublishHostPort
        else
            url=$siteUrlToLaunchAfterPublish
        fi

        echo "Attempting to connect to $url..."

        set +e
        i=0
        while [ $i -lt 5 ]
        do
            curl -s --head $url --max-time 10 | head -n 1 | grep "HTTP/1.[01] [23]..."

            if [ $? == 0 ]; then
                if [ -e "/Applications/Safari.app" ]; then
                    open -a /Applications/Safari.app $url
                elif [ -e "/usr/bin/firefox" ]; then
                    firefox $url &>/dev/null &
                else
                    echo -e "To see the web content, execute the command:\ncurl $url"
                fi

                exit
            fi

            sleep 5
            i=$((i+1))
        done

        logs=$(docker "$dockerAuthOptions" -H "$dockerServerUrl" logs "$containerId")
        echo -e "Failed to connect to $url. If your Docker host is an Azure virtual machine, please make sure to set up the endpoint $dockerPublishContainerPort using the Azure portal.\nContainer logs:\n$logs\nPlease visit http://go.microsoft.com/fwlink/?LinkID=529706 for troubleshooting guide."
    fi

else
    echo "Publish completed successfully. The container was not started because the DockerBuildOnly flag was set to True."
fi
