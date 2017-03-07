import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fse = require('fs-extra');
import mockfs = require('mock-fs');
import assert = require('assert');

let rootDir = path.join(__dirname, '..', 'instrumented');
let taskPath = path.join(rootDir, 'replaceTokensInPaths.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true,
        "testing": true
    },
    "glob": {
        "working\\*.config" : [ path.join("working", "file.config") ],
        "testing\\*.config" : [ path.join("testing", "file.config") ]
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
`,
"testing/file.config": `
<configuration>
  <appSettings>
    <add key="CoolKey" value="__CoolKey__" />
    <add key="Secret1" value="__Secret1__" />
  </appSettings>
</configuration>
`});
tmr.registerMock('fs', _mockfs);

// set inputs
tmr.setInput('sourcePaths', "working;testing");
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

if (actual !== expected) {
  console.log(actual);
  console.error("Replacement failed.");
} else {
  console.log("Replacement succeeded!")
}

let actual2 = (<any>_mockfs).readFileSync('working/file.config', 'utf-8');

if (actual2 !== expected) {
  console.log(actual);
  console.error("Replacement failed.");
} else {
  console.log("Replacement succeeded!")
}