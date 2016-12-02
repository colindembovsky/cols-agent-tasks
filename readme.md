# Colin's ALM Corner Custom Build Tasks

![Build Status](https://colinsalmcorner.visualstudio.com/_apis/public/build/definitions/34532943-412e-4dac-b314-a87833e22dd8/22/badge)

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----MIIHTwYJKoZIhvcNAQcEoIIHQDCCBzwCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYAoxJzaeka5hGw5NU2HTXw29ujulpTm7E2A/rpa2cQeyCoOjlyskcQdNg/wi1U02JFJdIS06xbme9b6tIHQGHcfgvSVhv3zGMd/eQuTCy6ZsP2X+fyS4bkiZeBiLebNiyzO7+NK70p2Fej01yFOPpb0S1FxaVv61Lz9pimuS8nqCzELMAkGBSsOAwIaBQAwgcwGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQIddTsemdnuYeAgah96NLCXNLEQwACBGyhWQmh3Q/lQoI6TbnmKYfrxWSMHUVXYHTO+gvuIahywPALfU1t7gnOM7PbJiBa3qKEvD/BOTVYlVzMW322e2Yr+wFAzYWSh5MU1ATUgmcamUuoPb3i3CRMFXM2qvtbHW8c1UwYhimwxkxpRq8YGG9E3nyvTZKvh8jvvJBzDGdIi1tW9c2Tc2ig1PnoT7hlkFa+yv2Xlo9fwUY5HMGgggOHMIIDgzCCAuygAwIBAgIBADANBgkqhkiG9w0BAQUFADCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wHhcNMDQwMjEzMTAxMzE1WhcNMzUwMjEzMTAxMzE1WjCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMFHTt38RMxLXJyO2SmS+Ndl72T7oKJ4u4uw+6awntALWh03PewmIJuzbALScsTS4sZoS1fKciBGoh11gIfHzylvkdNe/hJl66/RGqrj5rFb08sAABNTzDTiqqNpJeBsYs/c2aiGozptX2RlnBktH+SUNpAajW724Nv2Wvhif6sFAgMBAAGjge4wgeswHQYDVR0OBBYEFJaffLvGbxe9WT9S1wob7BDWZJRrMIG7BgNVHSMEgbMwgbCAFJaffLvGbxe9WT9S1wob7BDWZJRroYGUpIGRMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbYIBADAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4GBAIFfOlaagFrl71+jq6OKidbWFSE+Q4FqROvdgIONth+8kSK//Y/4ihuE4Ymvzn5ceE3S/iBSQQMjyvb+s2TWbQYDwcp129OPIbD9epdr4tJOUNiSojw7BHwYRiPh58S1xGlFgHFXwrEBb3dgNbMUa+u4qectsMAXpVHnD9wIyfmHMYIBmjCCAZYCAQEwgZQwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tAgEAMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNjEyMDIwNTE3MDhaMCMGCSqGSIb3DQEJBDEWBBQ/MHIdPMegULc/USyeoUkVs0dz/DANBgkqhkiG9w0BAQEFAASBgCpXLbiiKAPptprPspUVlYQk1NRfSQB90wI4g/CyUxOjmvGV/LQvALihll00G63SWNtaAMacpoLUZKETDYVfjcC20wTyU8kO/1+n85as3ek4Ymm5JgzHYqSoWOyH/ME/XaesnvIl6NxJCHRY5m/6VMTs9JZMD4vw1z/nPT6Eq4Yi-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>

> As [Scott Hanselman](http://www.hanselman.com/) says, "donations pay for tacos" (or low carb equivalent).

## Overview
This repo contains custom tasks that meant to be used with Visual Studio Online and Team Foundation Server.

## Uploading Tasks
You need to upload these tasks to your TFS / VSTS server.

1. Clone the repo
2. Install [tfx-cli] (https://github.com/Microsoft/tfs-cli)
3. Run `npm install` in the root folder.
4. Run `npm install` in each Task folder.
4. Run `tfx login` to login to your server.
5. Run `tfx build tasks upload --task-path <path to task folder>` to upload a task, where <path to task folder> is the path 
to the Task folder of the task you want to upload

The task should now be available on your TFS / VSO.

## Tasks
The following tasks are available:

1. **Version Assemblies**

	This task versions assemblies according to the build number. [More...](./Tasks/VersionAssemblies)

2. **Replace Tokens**

	This task replaces tokens in a file using Environment variables. [More...](./Tasks/ReplaceTokens)

3. **Docker Publish (Deprecated)**

	This task performs `docker build` and (optionally) `docker run` to deploy your app to a docker host. [More...](./Tasks/DockerPublish)

4. **Azure Web Deploy (Deprecated)**

	This task executes WebDeploy to publish a WebDeploy package to an Azure Web App. [More...](./Tasks/AzureWebDeploy)

## Changing the Code
The easiest way to open the source is to clone the repo and open in [VSCode](https://code.visualstudio.com/). 
If you change the .ts files, then run build (ctrl-shift-b) to compile the .js files.

## Creating the Extension Package
Help Pages can be found [here](https://www.visualstudio.com/en-us/integrate/extensions/overview).

To compile the extension, update the version number in the `extension-manifest.json` file and run:
```
tfx extension create --manifest-globs .\extension-manifest.json
```

Upload to the marketplace by singing in to your [publisher profile](http://aka.ms/vsmarketplace-manage).
