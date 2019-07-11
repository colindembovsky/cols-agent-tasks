"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
const mocks = require("./mockWebApi");
let rootDir = path.join(__dirname, '../../Tasks', 'TagBuild');
let taskPath = path.join(rootDir, 'tagBuild.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.registerMock('azure-devops-node-api/WebApi', mocks.MockWebApi);
// set variables
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "http://localhost:8080/tfs/defaultcollection";
process.env["SYSTEM_TEAMPROJECT"] = "demo";
process.env["RELEASE_RELEASEID"] = "21";
process.env["SYSTEM_ACCESSTOKEN"] = "faketoken";
// set inputs
tmr.setInput('tags', 'tag1');
tmr.setInput('type', 'Release');
tmr.run();
// hack since testrunner returns void but tasks can be Promise<void>
setTimeout(t => {
    if ("demo" !== mocks.MockWebApi.taggerCall.project ||
        "Release" !== mocks.MockWebApi.taggerCall.callType ||
        21 !== mocks.MockWebApi.taggerCall.id ||
        !mocks.MockWebApi.taggerCall.tags.some(t => t === "tag1") ||
        mocks.MockWebApi.taggerCall.tags.length !== 1) {
        console.log(mocks.MockWebApi.taggerCall);
        console.error("Tagging failed.");
    }
    else {
        console.log("Tagging successful!");
    }
}, 50);
//# sourceMappingURL=test-tagRelease-succeeds.js.map