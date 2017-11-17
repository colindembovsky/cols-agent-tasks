import * as tl from 'vsts-task-lib/task';
import * as vstsInterfaces from 'vso-node-api/interfaces/common/VsoBaseInterfaces';
import * as webApi from 'vso-node-api/WebApi';

async function run() {
    try {
        tl.debug("Starting Coverage Gate task");

        var tpcUri = tl.getVariable("System.TeamFoundationCollectionUri");
        var teamProject = tl.getVariable("System.TeamProject");
        var buildId = parseInt(tl.getVariable("Build.BuildId"));
        var minDelta = parseInt(tl.getInput("minDelta", true));
        var operator = tl.getInput("operator", true);
        var username = tl.getInput("username", false);
        var password = tl.getInput("password", false);
        tl.debug(`minDelta: ${minDelta}`);
        tl.debug(`operator: ${operator}`);
        tl.debug(`username: ${username}`);

        // handle creds
        var credOk = true;
        var credHandler: vstsInterfaces.IRequestHandler;
        var accessToken = tl.getVariable("System.AccessToken");
        if (!accessToken || accessToken.length === 0) {
            if (username && username.length > 0) {
                tl.debug("Detected username: creating basic cred handler");
                credHandler = webApi.getBasicHandler(username, password);
            } else {
                tl.setResult(tl.TaskResult.Failed, "Could not find token for autheniticating. Please enable OAuth token in Build/Release Options or supply username/password.");
                credOk = false;
            }
        } else {
            tl.debug("Detected token: creating bearer cred handler");
            credHandler = webApi.getBearerHandler(accessToken);
        }

        if (credOk) {
            var vsts = new webApi.WebApi(tpcUri, credHandler);

            // get previous successful builds
            tl.debug("Connecting to test API");
            var testApi = vsts.getTestApi();

            tl.debug("Getting coverage data");
            // 1 = modules, 2 = function, 4 = block
            var covData = await testApi.getCodeCoverageSummary(teamProject, buildId);

            tl.debug("Analyzing coverage data");
            if (covData) {
                var data = covData.coverageData[0];
                var trends = data.coverageStats.filter(c => c.isDeltaAvailable)
                    .map(u => {
                        return {
                            Label: u.label,
                            Delta: u.delta
                        };
                    });
                if (trends.length === 0){
                    tl.setResult(tl.TaskResult.Failed, `There are no coverage deltas. Make sure you have at least 2 builds.`);
                }
                var fail = trends.some(t => operator === 'lt' ? t.Delta < minDelta : t.Delta <= minDelta);
                if (fail) {
                    tl.setResult(tl.TaskResult.Failed, `Coverage delta is below the threshold of ${minDelta}`);
                }
            } else {
                tl.setResult(tl.TaskResult.Failed, "No coverage data for build. Cannot determine trend.");
            }
            tl.setResult(tl.TaskResult.Succeeded, `Code coverage delta is above the threshold of ${minDelta}`);
        }
    } catch (err) {
        tl.debug("Caught an error - logging");
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }
    tl.debug("Leaving Coverage Gate task");
}

run();