"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const tl = require('vsts-task-lib/task');
const webApi = require('vso-node-api/WebApi');
const bi = require('vso-node-api/interfaces/BuildInterfaces');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.debug("Starting Coverate Trend task");
            var tpcUri = tl.getVariable("System.TeamFoundationCollectionUri");
            var teamProject = tl.getVariable("System.TeamProject");
            var definitionId = parseInt(tl.getVariable("System.DefinitionId"));
            // handle creds
            var credHandler;
            var accessToken = tl.getVariable("System.AccessToken");
            if (!accessToken || accessToken.length === 0) {
                tl.warning("Could not find token for autheniticating. Please enable OAuth token in Build Options");
            }
            credHandler = webApi.getBearerHandler(accessToken);
            var vsts = new webApi.WebApi(tpcUri, credHandler);
            // get previous successful builds
            tl.debug("Connecting to build and test APIs");
            var buildApi = vsts.getBuildApi();
            var testApi = vsts.getTestApi();
            tl.debug("Getting previous builds");
            var prevBuilds = yield buildApi.getBuilds(teamProject, [definitionId], null, // queues: number[]
            null, // buildNumber
            null, // new Date(2016, 1, 1),  // minFinishTime
            null, // maxFinishTime
            null, // requestedFor: string
            bi.BuildReason.All, bi.BuildStatus.Completed, bi.BuildResult.Succeeded, null, // tagFilters: string[]
            null, // properties: string[]
            5 // top: number
            );
            tl.debug("Calculating coverage trend");
            var buildId = prevBuilds[0].buildNumber;
            tl.debug(`Retrieved build with Id ${buildId}`);
            //1 = modules, 2 = function, 4 = block
            testApi.getBuildCodeCoverage(teamProject, parseInt(buildId), 4);
        }
        catch (err) {
            let msg = err;
            if (err.message) {
                msg = err.message;
            }
            tl.setResult(tl.TaskResult.Failed, msg);
        }
    });
}
run();
//# sourceMappingURL=coverageTrend.js.map