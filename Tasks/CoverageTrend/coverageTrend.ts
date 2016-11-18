import * as tl from 'vsts-task-lib/task';
import * as webApi from 'vso-node-api/WebApi';
import * as vstsInterfaces from 'vso-node-api/interfaces/common/VsoBaseInterfaces';
import * as bi from 'vso-node-api/interfaces/BuildInterfaces';
import * as ti from 'vso-node-api/interfaces/TestInterfaces';

async function run() {
    try {
        tl.debug("Starting Coverate Trend task");

        var tpcUri = tl.getVariable("System.TeamFoundationCollectionUri");
        var teamProject = tl.getVariable("System.TeamProject");
        var definitionId = parseInt(tl.getVariable("System.DefinitionId"));

        // handle creds
        var credHandler: vstsInterfaces.IRequestHandler;
        var accessToken = tl.getVariable("System.AccessToken");
        if (!accessToken || accessToken.length === 0) {
            tl.warning("Could not find token for autheniticating. Please enable OAuth token in Build Options");
        }
        credHandler = webApi.getBearerHandler(accessToken);
        var vsts = new webApi.WebApi(tpcUri, credHandler);

        // get previous successful builds
        tl.debug("Connecting to build and test APIs");
        var buildApi = vsts.getQBuildApi();
        var testApi = vsts.getTestApi();

        tl.debug("Getting previous builds");
        var prevBuilds = await buildApi.getBuilds(teamProject, [definitionId],
                        null,                       // queues: number[]
                        null,                       // buildNumber
                        null,                       //new Date(2016, 1, 1),  // minFinishTime
                        null,                       // maxFinishTime
                        null,                       // requestedFor: string
                        bi.BuildReason.All,
                        bi.BuildStatus.Completed,
                        bi.BuildResult.Succeeded,
                        null,                       // tagFilters: string[]
                        null,                        // properties: string[]
                        5                          // top: number
                        );
        
        tl.debug("Calculating coverage trend");
        var buildId = prevBuilds[0].buildNumber;
        //TODO
        //testApi.getBuildCodeCoverage(teamProject, buildId, )
        
    } catch (err) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }
}

run();