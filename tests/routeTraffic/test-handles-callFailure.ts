import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import mocks = require('./mocks');

let rootDir = path.join(__dirname, '../../Tasks', 'RouteTraffic');
let taskPath = path.join(rootDir, 'routeTraffic.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// provide fake responses
mocks.TestHttpClient.responses = [
    {
        url: "https://manage.me.fake/tenantId/oauth2/token/",
        response: Promise.resolve(new mocks.HttpClientResponse({
            statusCode: 200,
            statusMessage: "ok",
            body: JSON.stringify({
                access_token : "fake-token-issue-from-token-endpoint"
            })
        }))
    },
    {
        url: "https://manage.me.fake/subscriptions/subId/resourceGroups/test-app/providers/Microsoft.Web/sites/test-app/config/web?api-version=2016-08-01",
        response: Promise.resolve(new mocks.HttpClientResponse({
            statusCode: 500,
            statusMessage: "something broke",
            body: ""
        }))
    }
];

// provide mocks
tmr.registerMock('typed-rest-client/HttpClient', mocks.TestHttpClient);
tmr.registerMockExport('getEndpointAuthorizationParameter', mocks.getEndpointAuthorizationParameter);
tmr.registerMockExport('getEndpointDataParameter', mocks.getEndpointDataParameter);
tmr.registerMockExport('getEndpointUrl', mocks.getEndpointUrl);

// set variables
process.env["AZURE_HTTP_USER_AGENT"] = "mock-user-agent";

// set inputs
tmr.setInput('ConnectedServiceName', "MyAzureEndpoint");
tmr.setInput('Slot', "blue");
tmr.setInput('WebAppName', "test-app");
tmr.setInput('ResourceGroupName', "test-app");
tmr.setInput('percentTraffic', "22.345");

tmr.run();