# Colin's ALM Corner Build Tasks - Web Deploy

## Overview
This task invokes Web Deploy to either Azure or IIS.

## Settings
The task requires the following settings:

1. **Source Path**: path to the sources that contain the version number files (such as AssemblyInfo.cs).
2. **File Pattern**: file pattern to search for within the `Source Path`. Defaults to "AssemblyInfo.*"
3. **Build Regex Pattern**: Regex pattern to apply to the build number in order to extract a version number. Defaults to `\d+\.\d+\.\d+\.\d+`.
4. **(Optional) Regex Replace Pattern**: Use this if the regex to search for in the target files is different from the Build Regex Pattern.  