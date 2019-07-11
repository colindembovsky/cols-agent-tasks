"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
const mocks = require("./mocks");
let rootDir = path.join(__dirname, '../../Tasks', 'RouteTraffic');
let taskPath = path.join(rootDir, 'routeTraffic.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// provide fake responses
mocks.TestHttpClient.responses = [
    {
        url: "https://manage.me.fake/tenantId/oauth2/token/",
        response: Promise.resolve(new mocks.HttpClientResponse({
            statusCode: 401,
            statusMessage: "access denied",
            body: null
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
//# sourceMappingURL=test-handles-authFailure.js.map