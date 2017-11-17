import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import assert = require('assert');
import mocks = require('./mockWebApi');

let rootDir = path.join(__dirname, '../../Tasks', 'TagBuild');
let taskPath = path.join(rootDir, 'tagBuild.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.registerMock('vso-node-api/WebApi', mocks.MockWebApi);

// set variables
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "http://localhost:8080/tfs/defaultcollection";
process.env["SYSTEM_TEAMPROJECT"] = "demo";
process.env["BUILD_BUILDID"] = "1";
process.env["SYSTEM_ACCESSTOKEN"] = "faketoken";

// set inputs
tmr.setInput('tags', `tag1
tag2`);
tmr.setInput('type', 'Build');

tmr.run();

if ("demo" !== mocks.MockWebApi.taggerCall.project ||
    "Build" !== mocks.MockWebApi.taggerCall.callType ||
    1 !== mocks.MockWebApi.taggerCall.id ||
    !mocks.MockWebApi.taggerCall.tags.some(t => t === "tag1") || 
    !mocks.MockWebApi.taggerCall.tags.some(t => t === "tag2") || 
    mocks.MockWebApi.taggerCall.tags.length !== 2) {
    console.log(mocks.MockWebApi.taggerCall);
    console.error("Tagging failed."); 
} else {
    console.log("Tagging successful!");
}