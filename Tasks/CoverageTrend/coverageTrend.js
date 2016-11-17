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
const httpClient = require('vso-node-api/HttpClient');
const restClient = require('vso-node-api/RestClient');
const buildApi = require('vso-node-api/BuildApi');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.debug("Starting Coverate Trend task");
            var tpcUri = tl.getVariable("System.TeamFoundationCollectionUri");
            var projectId = tl.getVariable("System.TeamProjectId");
            var rootUri = `{tpcUri}{projectId}/_apis`;
            // handle headers
            var accessToken = tl.getVariable("System.AccessToken");
            if (!accessToken || accessToken.length === 0) {
                tl.warning("Could not find token for autheniticating. Please enable OAuth token in Build Options");
            }
            var headerName = "Bearer";
            var inBuild = tl.getVariable("TF.BUILD");
            if (!inBuild || inBuild.length === 0) {
                tl.debug("*** NOT RUNNING IN A BUILD ***");
                headerName = "Basic"; //s = `@{Authorization = "Basic ${accessToken}"}`;
            }
            var authHeader = `${headerName} ${accessToken}`;
            var args = {
                headers: {}
            };
            args.headers[headerName] = authHeader;
            var httpObj = new httpClient.HttpClient("userAgent??");
            var client = new restClient.RestClient(httpObj);
            var buildClient = new buildApi.BuildApi(rootUri, null);
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