# Colin's ALM Corner Build Tasks - Tag Build

![Tag Build/Release Task](../../images/ss_tagBuild.png)

## Overview
This task tags a build/release with the tags specified.

## Settings
The task requires the following settings:

1. **Type**: Build or Release (see below for explanation).
1. **Tags**: Tags to add to the build. Can be multi-line for multiple tags.

## Tagging Types Matrix

| Definition Type | Tag Type | Notes |
| --- | --- | ------ |
| Build | Build | Tags the current build with the tags |
| Build | Release | Throws an error |
| Release | Release | Tags the current release with the tags |
| Release | Build | Tags the primary build artifact's build with the tags |