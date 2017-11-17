import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import assert = require('assert');
import mocks = require('./mocks');

let rootDir = path.join(__dirname, '../../Tasks', 'CoverageGate');
let taskPath = path.join(rootDir, 'coverageGate.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

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
tmr.registerMock('vso-node-api/WebApi', mocks.MockWebApi);

// set variables
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "http://localhost:8080/tfs/defaultcollection";
process.env["SYSTEM_TEAMPROJECT"] = "demo";
process.env["BUILD_BUILDID"] = "1";

// set inputs
tmr.setInput('minDelta', "0");
tmr.setInput('operator', "lt");
tmr.setInput('username', "bob");
tmr.setInput('password', "p@ssw0rd");

tmr.run();

// assert
if (mocks.MockWebApi.calledBearer) {
  console.error("Bearer auth called.");
} else {
  console.log("Bearer auth not called.")
}

if (mocks.MockWebApi.calledBasic) {
  console.log("Basic auth called.");
} else {
  console.error("Basic auth not called.")
}