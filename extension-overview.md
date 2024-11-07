# Colin's ALM Corner Custom Build Tasks
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/colindembovsky/cols-agent-tasks/blob/master/LICENSE.txt)

This extension contains helpful build and release Tasks.

[![Donate](https://raw.githubusercontent.com/colindembovsky/cols-agent-tasks/master/images/donate.png)](https://www.paypal.me/ColinDembovsky/5)

> As [Scott Hanselman](http://www.hanselman.com/) says, "Donations pay for tacos" (or low carb equivalent).

Click on the 'More...' link for each task to see how yaml references.

1. **Version Assemblies**

	This task versions assemblies according to the build number. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/VersionAssemblies)

1. **Replace Tokens**

	This task replaces tokens in a file using Environment variables. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/ReplaceTokens)

1. **DacPac Change Report Task**

	This task calculates the changes in an SSDT project between builds. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/DacPacReport)

1. **Tokenizer**

	This task tokenizes a file automatically. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/Tokenizer)

1. **Coverage Gate**

	This task allows you to fail a release (or build) based of coverage delta. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/CoverageGate)

1. **Tag Build / Release**

	This task allows you to add tags to a build or release. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/TagBuild)

1. **Route Traffic**

	This task allows you to route a percentage of traffic to an Azure Web App to a slot. [More...](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/RouteTraffic)

## Status


|Stage|Status|
|---|---|
|Build|[![Build Status](https://dev.azure.com/colinsalmcorner/MarketPlace/_apis/build/status/MarketPlace-yaml-pipeline?branchName=master&jobName=Build%20and%20test)](https://dev.azure.com/colinsalmcorner/MarketPlace/_build/latest?definitionId=33&branchName=master)|
|Beta|[![Build Status](https://dev.azure.com/colinsalmcorner/MarketPlace/_apis/build/status/MarketPlace-yaml-pipeline?branchName=master&jobName=Beta)](https://dev.azure.com/colinsalmcorner/MarketPlace/_build/latest?definitionId=33&branchName=master)|
|Marketplace|[![Build Status](https://dev.azure.com/colinsalmcorner/MarketPlace/_apis/build/status/MarketPlace-yaml-pipeline?branchName=master&jobName=Marketplace)](https://dev.azure.com/colinsalmcorner/MarketPlace/_build/latest?definitionId=33&branchName=master)|

## Release Notes

### 1.4.162
- Update runner to Node18
- Update tests

### 1.4.152
- Update runner to Node10
- Update to latest NodeJS task lib
- Update dependencies
- Update nyc/moch to latest versions, and update config
- Add release stages to YML pipeline

### 1.4.114
- DacPacReport
	- Update retrieval of SYSTEM_ACCESSTOKEN to make DacPacReport yml compatible. Fixes this [issue](https://github.com/colindembovsky/cols-agent-tasks/issues/131).

### 1.4.110
- DacPacReport
	- Fix `sqlpacakge.exe` missing path [issue](https://github.com/colindembovsky/cols-agent-tasks/issues/130) by updating PS module as well as adding a new param to allow users to specify the path to `sqlpackage.exe`

### 1.4.94
- ReplaceTokens
	- Added [Throw error on missing variable](https://github.com/colindembovsky/cols-agent-tasks/issues/109) option (thanks to [Gabriel Górski](https://github.com/Glaeqen))
- General
	- Updated code coverage settings to get coverage to calculate for tests
	- Updated vsts-task-lib to [azure-pipelines-task-lib](https://github.com/microsoft/azure-pipelines-task-lib)
	- Updated readmes for VersionAssemblies and ReplaceTokens in response to [this issue](https://github.com/colindembovsky/cols-agent-tasks/issues/126).

### 1.4.85
- DacPacReport
	- Fix `vswhere.exe` missing [issue](https://github.com/colindembovsky/cols-agent-tasks/issues/117)

### 1.4.79
- Tokenizer & ReplaceTokens
	- Fixed [arrays tokenization](https://github.com/colindembovsky/cols-agent-tasks/issues/43) from [this PR](https://github.com/colindembovsky/cols-agent-tasks/pull/112) - thanks to [@RunnX](https://github.com/RunnX) for contributions!
	
### 1.4.56
- Updated build/test instructions in README
- Tokenizer
	- Fixed [null issue](https://github.com/colindembovsky/cols-agent-tasks/issues/90) with some additional code on top of [this PR](https://github.com/colindembovsky/cols-agent-tasks/pull/93)

### 1.4.43
- No functional changes
- Update badges on README
- Update to [Azure DevOps Node API](https://www.npmjs.com/package/azure-devops-node-api) libs
- Change build process to [yaml file](https://github.com/colindembovsky/cols-agent-tasks/blob/master/azure-pipelines.yml) running on Ubuntu Hosted image

### 1.3.16
- Update ReplaceTokens Secrets description.

### 1.3.15
- Update tags and short description to improve search.

### 1.3.14
- Fixing [error when build is in a different team project to release](https://github.com/colindembovsky/cols-agent-tasks/issues/88) in DacPacCompare task

### 1.3.12
- Fixing [cannot find SqlPackage.exe in Hosted 2017 agent bug](https://github.com/colindembovsky/cols-agent-tasks/issues/75) in DacPacCompare task
- Bumped minor version to match catalog

### 1.1.178
- Fixing [cannot find module 'vso-node-api/webApi' bug](https://github.com/colindembovsky/cols-agent-tasks/issues/77) in TagBuild task

### 1.1.176
- Updating dependencies to latest versions
- Added `reverse` switch to DacPacReport task

### 1.1.174
- Fixing [releaseApi issue for TFS 2017.2](https://github.com/colindembovsky/cols-agent-tasks/issues/76)

### 1.1.173
- No task updates - just docs
	- PR updating [minimatch documentation](https://github.com/colindembovsky/cols-agent-tasks/pull/70)
	- PR updating [UWP examples](https://github.com/colindembovsky/cols-agent-tasks/pull/69)

### 1.1.169
- Fixed [file encoding issue](https://github.com/colindembovsky/cols-agent-tasks/issues/59)
- Fixed [trailing slash issue](https://github.com/colindembovsky/cols-agent-tasks/issues/60)

### 1.1.168
- Added new [Route Traffic task](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/RouteTraffic)

### 1.1.154
- Added new [Tag Build/Release task](https://github.com/colindembovsky/cols-agent-tasks/tree/master/Tasks/TagBuild)

### 1.1.119
- VersionAssemblies
	- Replacing sh.sed with `string.replace()` due to breaking change in `sh.sed` (see [this issue](https://github.com/colindembovsky/cols-agent-tasks/issues/57))

### 1.1.117
- No major task updates, but lots of internal work
	- Updated to latest vsts-task-lib
		- had to fix a breaking change (`tl.glob` function removed - had to use `tl.findMatch`)
	- Updated manifest to include link to Github repo and build badge
	- Updated node packages
	- Refactored tests to remove mock-fs dependency
	- Removed gulp and moved to npm (yarn) scripts
	- Fixed test coverage reporting
	- Bumped major/minor version numbers

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

