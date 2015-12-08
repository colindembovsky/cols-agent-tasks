# Colin's ALM Corner Custom Build Tasks

## Overview
This repo contains custom tasks that meant to be used with Visual Studio Online and Team Foundation Server.

## Uploading Tasks
You need to upload these tasks to your TFS / VSTS server.

1. Clone the repo
2. Install [tfx-cli] (https://github.com/Microsoft/tfs-cli)
3. Run `npm install` in the root folder.
4. Run `npm install` in each Task folder.
4. Run `tfx login` to login to your server.
5. Run `tfx build tasks upload <path to task folder>` to upload a task, where <path to task folder> is the path 
to the Task folder of the task you want to upload

The task should now be available on your TFS / VSO.

## Tasks
The following tasks are available:

1. **Version Assemblies**

	This task versions assemblies according to the build number. [More...](./Tasks/VersionAssemblies)

2. **Docker Publish**

	This task performs `docker build` and (optionally) `docker run` to deploy your app to a docker host. [More...](./Tasks/DockerPublish)
		
3. **Replace Tokens**

	This task replaces tokens in a file using Environment variables. [More...](./Tasks/ReplaceTokens)

4. **Azure Web Deploy**

	This task executes WebDeploy to publish a WebDeploy package to an Azure Web App. [More...](./Tasks/AzureWebDeploy)

## Changing the Code
The easiest way to open the source is to clone the repo and open in [VSCode](https://code.visualstudio.com/). 
If you change the .ts files, then run build (ctrl-shift-b) to compile the .js files.