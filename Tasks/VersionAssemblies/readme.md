# Colin's ALM Corner Build Tasks - Version Assemblies

![Version Assemblies Task](../../images/ss_versionAssemblies.png)

## Overview
This task versions assemblies so that the assembly version matches the version portion of the build number.

## Settings
The task requires the following settings:

1. **Source Path**: path to the sources that contain the version number files (such as AssemblyInfo.cs).
2. **File Pattern**: file pattern to search for within the `Source Path`. Defaults to "AssemblyInfo.*"
3. **Build Regex Pattern**: Regex pattern to apply to the build number in order to extract a version number. Defaults to `\d+\.\d+\.\d+\.\d+`.
4. **(Optional) Regex Replace Pattern**: Use this if the regex to search for in the target files is different from the Build Regex Pattern.  

## Using the Task
The task should be inserted before any build tasks.

Also, you must customize the build number format (on the General tab of the build definition) in order to specify a format in such a way that the `Build Regex Pattern` can extract a build number from it. For example, if the build number is `1.0.0$(rev:.r)`, then you can use the regex `\d+\.\d+\.\d+\.\d+` to extract the version number.
