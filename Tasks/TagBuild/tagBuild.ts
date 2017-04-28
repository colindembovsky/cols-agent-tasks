import * as tl from 'vsts-task-lib/task';
import * as vstsInterfaces from 'vso-node-api/interfaces/common/VsoBaseInterfaces';
import * as webApi from 'vso-node-api/webApi';

async function run() {
    try {
        tl.debug("Starting Tag Build/Release task");

        let tpcUri = tl.getVariable("System.TeamFoundationCollectionUri");
        let teamProject = tl.getVariable("System.TeamProject");
        let type = tl.getInput("type", true);
        let tags = tl.getDelimitedInput("tags", '\n', true);

        let bOk = true;
        let buildId = -1;
        let bId = tl.getVariable("Build.BuildId");
        // just for tests
        if (bId === "-1") {
            bId = null;
        }
        if (bId) {
            buildId = parseInt(bId);
            tl.debug(`Build ID = ${buildId}`);
        } else {
            if (type === "Build") {
                tl.setResult(tl.TaskResult.Failed, "No build ID found - perhaps Type should be 'Release' not 'Build'?");
                tl.debug("Leaving Tag Build task");
                bOk = false;
            } 
        }

        if (bOk) {
            let rOk = true;
            let releaseId = -1;
            let rId = tl.getVariable("Release.ReleaseId");
            if (rId) {
                releaseId = parseInt(rId);
                tl.debug(`Release ID = ${releaseId}`);
            } else {
                if (type === "Release") {
                    tl.setResult(tl.TaskResult.Failed, "No release ID found - perhaps Type should be 'Build' not 'Release'?");
                    tl.debug("Leaving Tag Build task");
                    rOk = false;
                } 
            }
            
            if (rOk) {
                // handle creds
                let credHandler: vstsInterfaces.IRequestHandler;
                let accessToken = tl.getVariable("System.AccessToken");
                if (!accessToken || accessToken.length === 0) {
                    tl.setResult(tl.TaskResult.Failed, "Could not find token for autheniticating. Please enable OAuth token in Build/Release Options.");
                    tl.debug("Leaving Tag Build task");
                    return;
                } else {
                    tl.debug("Detected token: creating bearer cred handler");
                    credHandler = webApi.getBearerHandler(accessToken);
                }

                let vsts = new webApi.WebApi(tpcUri, credHandler);
                
                if (type === "Build") {
                    tl.debug("Getting build api client");
                    let buildApi = vsts.getBuildApi();
                    
                    console.info(`Setting tags on build [${buildId}]`);
                    buildApi.addBuildTags(tags, teamProject, buildId)
                        .catch(e => { throw e; });
                } else {
                    tl.debug("Getting release api client");
                    let releaseApi = vsts.getReleaseApi();
                    
                    console.info(`Setting tags on release [${releaseId}]`);
                    releaseApi.addReleaseTags(tags, teamProject, releaseId)
                        .catch(e => { throw e; });
                }

                tl.setResult(tl.TaskResult.Succeeded, `Successfully added tags to the ${type}`);
            }
        }
    }
    catch (err) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }

    tl.debug("Leaving Tag Build/Release task");
}

run();