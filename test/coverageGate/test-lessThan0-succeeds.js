"use strict";
const tmrm = require('vsts-task-lib/mock-run');
const path = require('path');
const mocks = require('./mocks');
var testRoot = path.resolve(__dirname);
let taskPath = path.join(__dirname, '..', '..', 'Tasks', 'CoverageGate', 'coverageGate.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// provide mocks
mocks.MockWebApi.setCovDataResult({
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
});
tmr.registerMock('vso-node-api/WebApi', mocks.MockWebApi);
// set variables
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "http://localhost:8080/tfs/defaultcollection";
process.env["SYSTEM_TEAMPROJECT"] = "demo";
process.env["BUILD_BUILDID"] = "1";
process.env["SYSTEM_ACCESSTOKEN"] = "faketoken";
// set inputs
tmr.setInput('minDelta', "0");
tmr.setInput('operator', "lt");
tmr.run();
//# sourceMappingURL=test-lessThan0-succeeds.js.map