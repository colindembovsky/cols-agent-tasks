import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import { MockWebApi } from './mockWebApi';

let rootDir = path.join(__dirname, '../../Tasks', 'TagBuild');
let taskPath = path.join(rootDir, 'tagBuild.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.registerMock('azure-devops-node-api/WebApi', MockWebApi);

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
    if ("demo" !== MockWebApi.taggerCall.project ||
        "Build" !== MockWebApi.taggerCall.callType ||
        1 !== MockWebApi.taggerCall.id ||
        !MockWebApi.taggerCall.tags.some(t => t === "tag1") || 
        MockWebApi.taggerCall.tags.length !== 1) {
        console.error("Tagging failed."); 
    } else {
        console.log("Tagging successful!");
    }
}, 50);