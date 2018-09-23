# Colin's ALM Corner Custom Build Tasks

![Build Status](https://colinsalmcorner.visualstudio.com/_apis/public/build/definitions/34532943-412e-4dac-b314-a87833e22dd8/22/badge)

[![Donate](./images/donate.png)](https://www.paypal.me/ColinDembovsky/5)

> As [Scott Hanselman](http://www.hanselman.com/) says, "donations pay for tacos" (or low carb equivalent).

## Overview
This repo contains custom tasks that meant to be used with Visual Studio Online and Team Foundation Server.

## Build and Test
Use `yarn` to build and test these extensions. All `yarn` scripts are specified in the `package.json` file. Run `yarn run` to get a prompt of all the targets. The most important are:

1. `install`: install dependencies in root folder.
1. `install-libs` install dependencies in each Task folder (required since each task has to be self-contained).
1. `test` to run tests.
1. `debugtest` to run tests with verbose logging.
1. `cover` to run tests with code coverage.
1. `prepextension` to run `install` and `coverage` (used to package the extension in the build).

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
