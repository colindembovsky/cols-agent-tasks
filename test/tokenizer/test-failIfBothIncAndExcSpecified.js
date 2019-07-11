"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let rootDir = path.join(__dirname, '../../Tasks', 'Tokenizer');
let taskPath = path.join(rootDir, 'tokenizer.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// set up a tmp file for the test
var workingFolder = path.join(__dirname, "working");
var tmpFile = path.join(workingFolder, "appsettings.json");
// provide answers for task mock
let a = {
    "checkPath": {
        "working": true
    },
    "findMatch": {
        "appsettings.json": [tmpFile]
    }
};
tmr.setAnswers(a);
// set inputs
tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', 'appsettings.json');
tmr.setInput('tokenizeType', 'Json');
tmr.setInput('includes', 'blah');
tmr.setInput('excludes', 'foo');
tmr.setInput('nullBehavior', 'warning');
tmr.run();
// expect failures
//# sourceMappingURL=test-failIfBothIncAndExcSpecified.js.map