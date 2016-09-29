import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fse = require('fs-extra');
import mockfs = require('mock-fs');
import assert = require('assert');

var testRoot = path.resolve(__dirname);
let taskPath = path.join(__dirname, '..', '..', 'Tasks', 'ReplaceTokens', 'replaceTokens.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "glob": {
        "working\\*.config" : [ path.join("working", "file.config") ]
    }
};
tmr.setAnswers(a);

// mock the fs
let _mockfs = mockfs.fs({
    "working/file.config": `
<configuration>
  <appSettings>
    <add key="CoolKey" value="__CoolKey__" />
    <add key="Secret1" value="__Secret1__" />
  </appSettings>
</configuration>
`});
tmr.registerMock('fs', _mockfs);

// set inputs
tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', '*.config');
tmr.setInput('tokenRegex', '__(\\w+)__'); 

// set variables
process.env["CoolKey"] = "MyCoolKey";
process.env["SECRET_Secret1"] = "supersecret1";

tmr.run();

// validate the replacement
let actual = (<any>_mockfs).readFileSync('working/file.config', 'utf-8');
var expected = `
<configuration>
  <appSettings>
    <add key="CoolKey" value="MyCoolKey" />
    <add key="Secret1" value="supersecret1" />
  </appSettings>
</configuration>
`;
throw "hahah";
//assert(expected.indexOf(actual) >= 0, 'should match');