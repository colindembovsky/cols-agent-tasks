import * as tl from 'vsts-task-lib/task';
import * as vstsInterfaces from 'vso-node-api/interfaces/common/VsoBaseInterfaces';
import * as webApi from 'vso-node-api/webApi';

async function run() {
    try {
        tl.debug("Starting Tag Build task");

        let tpcUri = tl.getVariable("System.TeamFoundationCollectionUri");
        let teamProject = tl.getVariable("System.TeamProject");
        let buildId = parseInt(tl.getVariable("Build.BuildId"));
        let tags = tl.getDelimitedInput("tags", '\n', true);

        tl.debug(`tags: [${tags.join(',')}]`);

        // handle creds
        var credOk = true;
        var credHandler: vstsInterfaces.IRequestHandler;
        var accessToken = tl.getVariable("System.AccessToken");
        if (!accessToken || accessToken.length === 0) {
            tl.setResult(tl.TaskResult.Failed, "Could not find token for autheniticating. Please enable OAuth token in Build/Release Options.");
            credOk = false;
        } else {
            tl.debug("Detected token: creating bearer cred handler");
            credHandler = webApi.getBearerHandler(accessToken);
        }

        if (credOk) {
            var vsts = new webApi.WebApi(tpcUri, credHandler);
            
            tl.debug("Getting build api client");
            var buildApi = vsts.getBuildApi();
            
            console.info(`Setting tags on build [${buildId}]`);
            buildApi.addBuildTags(tags, teamProject, buildId);
        }

        tl.setResult(tl.TaskResult.Succeeded, `Successfully added tags to the build`);
    }
    catch (err) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }

    tl.debug("Leaving Tag Build task");
}

run();