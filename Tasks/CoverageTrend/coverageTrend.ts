import * as tl from 'vsts-task-lib/task';
import * as httpClient from 'vso-node-api/HttpClient';
import * as restClient from 'vso-node-api/RestClient';
import * as buildApi from 'vso-node-api/BuildApi';

async function run() {
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
            headers: { }
        };
        args.headers[headerName] = authHeader;
        
        var httpObj = new httpClient.HttpClient("userAgent??");
        var client = new restClient.RestClient(httpObj);
        var buildClient = new buildApi.BuildApi(rootUri, null);

        // TODO: figure out how to call the build api
        //buildClient.getBuilds();

        // var buildDefId = tl.getVariable("System.DefinitionId");
        // var previousBuildUri = `{rootUri}/build/builds?definitions=${buildDefId}&resultFilter=succeeded&$top=1&api-version=2.0`;

        // client.getJson(previousBuildUri, "2.0", )


        // client.getJson(previousBuildUri, args, (buildData, buildRes) => {
        //     // TODO: extract prevBuildId from data
        //     var previousBuildId = 1;

        //     // get the coverage info for the previous build
        //     var coverageUri = `{rootUri}/test/codeCoverage/?buildId=${previousBuildId}&flags=7&api-version=2.0-preview`;
        //     client.get(coverageUri, args, (covData, covRes) => {
        //         console.log(covData);
        //     });
        // });
    } catch (err) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }
}

run();