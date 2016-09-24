import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');
import fse = require('fs-extra');

var testRoot = path.resolve(__dirname);

// create a clean working folderB
let workingDir = path.resolve(testRoot, "_working");
if (fs.existsSync(workingDir)) {
    fse.removeSync(workingDir);
}
fs.mkdirSync(workingDir);

let taskPath = path.join(__dirname, '..', '..', 'Tasks', 'ReplaceTokens', 'replaceTokens.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('sourcePath', workingDir);
tmr.setInput('filePattern', '*.config');
tmr.setInput('tokenRegex', '__(\\w+)__'); 

// set variables
//tr.setVariable('CoolKey', 'MyCoolKey');
//tr.setSecret('Secret1', 'supersecret1');

// process.env["CoolKey"] = "MyCoolKey";
// process.env["SECRET_Secret1"] = "supersecret1";
tmr.run();

// provide answers for task mock
// let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
//     "which": {
//         "echo": "/mocked/tools/echo"
//     },
//     "exec": {
//         "/mocked/tools/echo Hello, = require(task!": {
//             "code": 0,
//             "stdout": "atool output here",
//             "stderr": "atool with this stderr output"            
//         }
//     }
// };
// tmr.setAnswers(a);

// mock a specific module function called in task 
// tmr.registerMock('./taskmod', {
//     sayHello: function() {
//         console.log('Hello Mock!');
//     }
// });

tmr.run();