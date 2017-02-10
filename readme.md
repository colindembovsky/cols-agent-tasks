# Colin's ALM Corner Custom Build Tasks

![Build Status](https://colinsalmcorner.visualstudio.com/_apis/public/build/definitions/34532943-412e-4dac-b314-a87833e22dd8/22/badge)

[![Donate](./images/donate.png)](https://www.paypal.me/ColinDembovsky/5)

> As [Scott Hanselman](http://www.hanselman.com/) says, "donations pay for tacos" (or low carb equivalent).

## Overview
This repo contains custom tasks that meant to be used with Visual Studio Online and Team Foundation Server.

## Uploading Tasks
You need to upload these tasks to your TFS / VSTS server.

1. Clone the repo
1. Install [tfx-cli] (https://github.com/Microsoft/tfs-cli)
1. Run `yarn install` in the root folder.
1. Run `yarn install` in each Task folder.
1. Run `gulp build` to transpile.
1. Run `gulp test-cover` to run tests.
1. Run `tfx login` to login to your server.
1. Run `tfx build tasks upload --task-path <path to task folder>` to upload a task, where <path to task folder> is the path 
to the Task folder of the task you want to upload

The task should now be available on your TFS / VSO.

## Tasks
The following tasks are available:

1. **Version Assemblies**

	This task versions assemblies according to the build number. [More...](./Tasks/VersionAssemblies)

1. **Replace Tokens**

	This task replaces tokens in a file using Environment variables. [More...](./Tasks/ReplaceTokens)

1. **DacPac Change Report Task**

	This task calculates the changes in an SSDT project between builds. [More...](./Tasks/DacPacReport)

1. **Tokenizer**

	This task tokenizes a file automatically. [More...](./Tasks/Tokenizer)

1. **Coverage Gate**

	This task allows you to fail a release (or build) based of coverage delta. [More...](./Tasks/CoverageGate)
## Changing the Code
The easiest way to open the source is to clone the repo and open in [VSCode](https://code.visualstudio.com/). 
If you change the .ts files, then run build (ctrl-shift-b) to compile the .js files.

## Creating the Extension Package
Help Pages can be found [here](https://www.visualstudio.com/en-us/integrate/extensions/overview).

To compile the extension, update the version number in the `extension-manifest.json` file and run:
```
tfx extension create --manifest-globs .\vss-extension.json
```

Upload to the marketplace by singing in to your [publisher profile](http://aka.ms/vsmarketplace-manage).
