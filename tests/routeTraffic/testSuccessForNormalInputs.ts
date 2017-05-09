import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import mocks = require('./mocks');

let rootDir = path.join(__dirname, '../../Tasks', 'RouteTraffic');
let taskPath = path.join(rootDir, 'coverageGate.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// provide mocks
tmr.registerMock('typed-rest-client/HttpClient', mocks.TestHttpClient);
tmr.registerMockExport('getEndpointAuthorizationParameter', mocks.getEndpointAuthorizationParameter);
tmr.registerMockExport('getEndpointDataParameter', mocks.getEndpointDataParameter);
tmr.registerMockExport('getEndpointUrl', mocks.getEndpointUrl);

// set variables
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "http://localhost:8080/tfs/defaultcollection";
process.env["SYSTEM_TEAMPROJECT"] = "demo";
process.env["BUILD_BUILDID"] = "1";
process.env["SYSTEM_ACCESSTOKEN"] = "faketoken";

// set inputs
tmr.setInput('ConnectedServiceName', "MyAzureEndpoint");
tmr.setInput('Slot', "blue");
tmr.setInput('WebAppName', "test-app");
tmr.setInput('ResourceGroupName', "test-app");
tmr.setInput('percentTraffic', "22.345");

tmr.run();