import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');
import fse = require('fs-extra');

var testRoot = path.resolve(__dirname);

// create a clean working folder
let workingDir = path.join(testRoot, "_working");
fse.emptyDirSync(workingDir);
console.log(path.join(__dirname, "normalTokens.config"));
// fse.copySync fails for some weird reason, so fall back to "fs.copy"
fs.createReadStream(path.join(__dirname, "normalTokens.config")).pipe(fs.createWriteStream(path.join(workingDir, 'normalTokens.config')));

let taskPath = path.join(__dirname, '..', '..', 'Tasks', 'ReplaceTokens', 'replaceTokens.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "which": {
        "echo": "/mocked/tools/echo"
    },
    "checkPath": {
        "working": true
    },
    "glob": {
        "working\\*.config" : [ path.join(workingDir, "normalTokens.config") ]
    }
};
tmr.setAnswers(a);

tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', '*.config');
tmr.setInput('tokenRegex', '__(\\w+)__'); 

// set variables
//tr.setVariable('CoolKey', 'MyCoolKey');
//tr.setSecret('Secret1', 'supersecret1');

// process.env["CoolKey"] = "MyCoolKey";
// process.env["SECRET_Secret1"] = "supersecret1";
tmr.run();

// mock a specific module function called in task 
// tmr.registerMock('./taskmod', {
//     sayHello: function() {
//         console.log('Hello Mock!');
//     }
// });