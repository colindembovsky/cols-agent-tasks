# Colin's ALM Corner Build Tasks

## Overview
This repo contains custom tasks that meant to be used with Visual Studio Online and Team Foundation Server.

## Uploading Tasks
You need to upload these tasks to your TFS / VSO server.

1. Clone the repo
2. Install [tfx-cli] (https://github.com/Microsoft/tfs-cli)
3. Run `tfx login` to login
4. Run `tfx build tasks upload <path to task folder>` to upload a task, where <path to task folder> is the path to the Task folder of the task you want to upload

The task should now be available on your TFS / VSO.

## Tasks
The following tasks are available:

### Version Assemblies
This task versions assemblies according to the build number. [More...](./Tasks/VersionAssemblies)
