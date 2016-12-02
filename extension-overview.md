# Colin's ALM Corner Custom Build Tasks
This extension contains helpful build and release Tasks.

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>

> As [Scott Hanselman](http://www.hanselman.com/) says, "donations pay for tacos" (or low carb equivalent).

1. **Version Assemblies**

	This task versions assemblies according to the build number. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/VersionAssemblies)

1. **Replace Tokens**

	This task replaces tokens in a file using Environment variables. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/ReplaceTokens)

1. **DacPac Change Report Task**

	This task calculates the changes in an SSDT project between builds. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/DacPacReport)

1. **Tokenizer**

	This task tokenizes a file automatically. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/Tokenizer)

1. **Coverage Gate**

	This task allows you to fail a release (or build) based of coverage delta. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/CoverateGate)

## Release Notes

### 1.1.56
- Added Coverage Trend task

## Source Code
The source repo for this extension is [on Github.](https://github.com/colindembovsky/cols-agent-tasks)

### Deprecated Tasks
1. **Docker Publish (Deprecated)**

	This task performs `docker build` and (optionally) `docker run` to deploy your app to a docker host.

	> The [Docker Integration Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscs-rm.docker) is finally fully featured, so I'm deprecating this task.

1. **Azure Web Deploy (Deprecated)**

	This task executes WebDeploy to publish a WebDeploy package to an Azure Web App.

	> The [Azure RM WebApp Deploy Task](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks/AzureRmWebAppDeployment) now does everything this task does, so I'm deprecating this task.

