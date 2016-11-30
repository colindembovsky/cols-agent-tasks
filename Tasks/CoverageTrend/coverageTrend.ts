import * as tl from 'vsts-task-lib/task';
import * as webApi from 'vso-node-api/WebApi';
import * as buildApi from 'vso-node-api/BuildApi';
import * as vstsInterfaces from 'vso-node-api/interfaces/common/VsoBaseInterfaces';
import * as bi from 'vso-node-api/interfaces/BuildInterfaces';
import * as ti from 'vso-node-api/interfaces/TestInterfaces';

async function run() {
    try {
        tl.debug("Starting Coverate Trend task");

        var tpcUri = tl.getVariable("System.TeamFoundationCollectionUri");
        var teamProject = tl.getVariable("System.TeamProject");
        var definitionId = parseInt(tl.getVariable("System.DefinitionId"));
        var thisBuildId = parseInt(tl.getVariable("Build.BuildId"));

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
        var testApi = vsts.getTestApi();

        tl.debug("Getting coverage data");
        // 1 = modules, 2 = function, 4 = block
        var covData = await testApi.getCodeCoverageSummary(teamProject, thisBuildId);
        if (covData) {
            var data = covData.coverageData[0];
            var trends = data.coverageStats.filter(c => c.isDeltaAvailable)
                .map(u => {
                    return {
                        Label: u.label,
                        Delta: u.delta
                    };
                });
            var anyNeg = trends.some(t => t.Delta < 0);
        } else {
            tl.debug("No coverage data for build");
        }
        
        
    } catch (err) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }
}

run();