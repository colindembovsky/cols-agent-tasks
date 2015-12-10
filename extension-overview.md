# Colin's ALM Corner Custom Build Tasks
This extension contains helpful build and release Tasks.

1. **Version Assemblies**

	This task versions assemblies according to the build number.

2. **Docker Publish**

	This task performs `docker build` and (optionally) `docker run` to deploy your app to a docker host.
		
3. **Replace Tokens**

	This task replaces tokens in a file using Environment variables defined in a Release Definition.

4. **Azure Web Deploy**

	This task executes WebDeploy to publish a WebDeploy package to an Azure Web App.