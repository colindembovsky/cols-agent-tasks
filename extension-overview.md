# Colin's ALM Corner Custom Build Tasks
This extension contains helpful build and release Tasks.

1. **Version Assemblies**

	This task versions assemblies according to the build number.

2. **Replace Tokens**

	This task replaces tokens in a file using Environment variables.

3. **Docker Publish (Deprecated)**

	This task performs `docker build` and (optionally) `docker run` to deploy your app to a docker host.

	> The [Docker Integration Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscs-rm.docker) is finally fully featured, so I'm deprecating this task.

4. **Azure Web Deploy (Deprecated)**

	This task executes WebDeploy to publish a WebDeploy package to an Azure Web App.

	> The [Azure RM WebApp Deploy Task](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks/AzureRmWebAppDeployment) now does everything this task does, so I'm deprecating this task.