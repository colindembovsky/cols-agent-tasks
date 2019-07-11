"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
const mockWebApi_1 = require("./mockWebApi");
let rootDir = path.join(__dirname, '../../Tasks', 'TagBuild');
let taskPath = path.join(rootDir, 'tagBuild.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.registerMock('azure-devops-node-api/WebApi', mockWebApi_1.MockWebApi);
// set variables
let project = "demo";
let buildId = 1;
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "http://localhost:8080/tfs/defaultcollection";
process.env["SYSTEM_ACCESSTOKEN"] = "faketoken";
process.env["SYSTEM_TEAMPROJECT"] = project;
process.env["BUILD_BUILDID"] = buildId.toString();
// set inputs
tmr.setInput('tags', 'tag1');
tmr.setInput('type', 'Build');
tmr.run();
// need setTimeout because of async methods
setTimeout(() => {
    if ("demo" !== mockWebApi_1.MockWebApi.taggerCall.project ||
        "Build" !== mockWebApi_1.MockWebApi.taggerCall.callType ||
        1 !== mockWebApi_1.MockWebApi.taggerCall.id ||
        !mockWebApi_1.MockWebApi.taggerCall.tags.some(t => t === "tag1") ||
        mockWebApi_1.MockWebApi.taggerCall.tags.length !== 1) {
        console.error("Tagging failed.");
    }
    else {
        console.log("Tagging successful!");
    }
}, 50);
//# sourceMappingURL=test-singleTag-succeeds.js.map