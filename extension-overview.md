# Colin's ALM Corner Custom Build Tasks
This extension contains helpful build and release Tasks.

[![Donate](https://raw.githubusercontent.com/colindembovsky/cols-agent-tasks/master/images/donate.png)](https://www.paypal.me/ColinDembovsky/5)

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

![Build Status](https://colinsalmcorner.visualstudio.com/_apis/public/build/definitions/34532943-412e-4dac-b314-a87833e22dd8/22/badge)

### 1.1.89
- No task updates
- Updated manifest to include link to Github repo and build badge

### 1.1.86
- Tokenizer now supports [tokenizing arrays](https://github.com/colindembovsky/cols-agent-tasks/pull/51) within a json file.
- Great [contribution](https://github.com/colindembovsky/cols-agent-tasks/pull/52) adding examples of how to use VersionAssemblies for iOS and Windows packages to the [VersionAssemblies overview page](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/VersionAssemblies)

### 1.1.83
- MAJOR CHANGE: VersionAssemblies
	- improved UI for easier default settings.
	- you can now specify a custom variable to use for the versioning if you don't want to use the build number.

### 1.1.78
- Updated SourcePath for Tokenizer, ReplaceTokens and VersionAssemblies: leave empty to use the Build.SourcesDirectory.
- Updated the internal build process for the extension to use Yarn instead of npm and to use Gulp to transpile TypeScript sources to JS, instead of checking in JS files.

### 1.1.63
- No task updates - fixed automated build to install dependencies for Tokenizer.

### 1.1.62
- No task updates - added Tokenize task to extension manifest.

### 1.1.59
- No task updates - just added a PayPal donate button to the extension manifest.

### 1.1.57
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

