"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
const mocks = require("./mocks");
let rootDir = path.join(__dirname, '../../Tasks', 'CoverageGate');
let taskPath = path.join(rootDir, 'coverageGate.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// provide mocks
mocks.MockWebApi.covData = {
    coverageData: [{
            coverageStats: [
                {
                    isDeltaAvailable: true,
                    label: 'Lines',
                    delta: 0
                },
                {
                    isDeltaAvailable: true,
                    label: 'Blocks',
                    delta: 0
                }
            ]
        }
    ]
};
tmr.registerMock('azure-devops-node-api/WebApi', mocks.MockWebApi);
// set variables
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "http://localhost:8080/tfs/defaultcollection";
process.env["SYSTEM_TEAMPROJECT"] = "demo";
process.env["BUILD_BUILDID"] = "1";
process.env["SYSTEM_ACCESSTOKEN"] = "faketoken";
// set inputs
tmr.setInput('minDelta', "0");
tmr.setInput('operator', "lt");
tmr.run();
// assert to check bearer auth
if (mocks.MockWebApi.calledBearer) {
    console.log("Bearer auth called.");
}
else {
    console.error("Bearer auth not called.");
}
if (mocks.MockWebApi.calledBasic) {
    console.error("Basic auth called.");
}
else {
    console.log("Basic auth not called.");
}
//# sourceMappingURL=test-lessThan0-succeeds.js.map