"use strict";
const tmrm = require('vsts-task-lib/mock-run');
const path = require('path');
const mockfs = require('mock-fs');
var testRoot = path.resolve(__dirname);
let taskPath = path.join(__dirname, '..', '..', 'Tasks', 'Tokenizer', 'tokenizer.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// provide answers for task mock
let a = {
    "checkPath": {
        "working": true
    },
    "glob": {
        "working\\appsettings.json": [path.join("working", "appsettings.json")]
    }
};
tmr.setAnswers(a);
// mock the fs
let _mockfs = mockfs.fs({
    "working/appsettings.json": `doesn't matter`
});
tmr.registerMock('fs', _mockfs);
// set inputs
tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', 'appsettings.json');
tmr.setInput('tokenizeType', 'Json');
tmr.setInput('includes', 'blah');
tmr.setInput('excludes', 'foo');
tmr.run();
// expect failures 
//# sourceMappingURL=test-failIfBothIncAndExcSpecified.js.map