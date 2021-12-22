# Colin's ALM Corner Build Tasks - Tag Build

![Tag Build/Release Task](../../images/ss_tagBuild.png)

## Overview
This task tags a build/release with the tags specified.

## YAML

```yaml
steps:
- task: tagBuildOrRelease@0
  displayName: "Tag Build"
  inputs:
    type: 'Build' # Build or Release - specify which artifact to tag (default is Build)
    tags: |
      tag1
      tag2
```

## Settings
The task requires the following settings:

1. **Type**: Build or Release (see below for explanation).
1. **Tags**: Tags to add to the build. Can be multi-line for multiple tags.

## Permissions for Tagging Releases
In order to tag releases, the build service identity needs `Manage Releases` permissions. If the permissions are not set the task will fail with this error:

```
VS402904: Access denied: User Project Collection Build Service does not have manage releases permission. Contact your release manager.
```

You can set the permission as follows:
1. Click on the ellipses on the `All release definitions` node in the Release explorer and click `Security`.
    ![All Releases security](../../images/releasePerm-security.png)
1. Click on the `Project Collection Build Service` and set `Manage Releases` to `Allow`.
    ![Set Manage Releases to Allow](../../images/releasePerm-set.png)

## Tagging Types Matrix

| Definition Type | Tag Type | Notes |
| --- | --- | ------ |
| Build | Build | Tags the current build with the tags |
| Build | Release | Throws an error |
| Release | Release | Tags the current release with the tags |
| Release | Build | Tags the primary build artifact's build with the tags |
