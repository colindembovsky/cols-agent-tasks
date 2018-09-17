import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import { MockWebApi } from './mockWebApi';
import * as should from 'should';
import * as sinon from 'sinon';

let rootDir = path.join(__dirname, '../../Tasks', 'TagBuild');
let taskPath = path.join(rootDir, 'tagBuild.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.registerMock('azure-devops-node-api/WebApi', MockWebApi);

// set variables
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "http://localhost:8080/tfs/defaultcollection";
process.env["SYSTEM_TEAMPROJECT"] = "demo";
process.env["BUILD_BUILDID"] = "1";
process.env["SYSTEM_ACCESSTOKEN"] = "faketoken";

// set inputs
tmr.setInput('tags', 'tag1');
tmr.setInput('type', 'Build');

let spy = sinon.spy();

tmr.run();

console.log("=====");
console.log(state);

if ("demo" !== state.taggerCall.project ||
    "Build" !== state.taggerCall.callType ||
    1 !== state.taggerCall.id ||
    !state.taggerCall.tags.some(t => t === "tag1") || 
    state.taggerCall.tags.length !== 1) {
    console.error("Tagging failed."); 
} else {
    console.log("Tagging successful!");
}