import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fse = require('fs-extra');
import mockfs = require('mock-fs');

let rootDir = path.join(__dirname, '..', 'instrumented');
let taskPath = path.join(rootDir, 'replaceTokens.js');
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
    <add key="AtSym" value="@@CUSTOM_BUILDMAJORNUM@@.@@CUSTOM_BUILDMINORNUM@@.@@CUSTOM_BUILDPATCHNUM@@" />
  </appSettings>
</configuration>
`});
tmr.registerMock('fs', _mockfs);

// set inputs
tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', '*.config');
tmr.setInput('tokenRegex', '@@(\\w+)@@'); 

// set variables
process.env["CUSTOM_BUILDMAJORNUM"] = "1";
process.env["CUSTOM_BUILDMINORNUM"] = "2";
process.env["CUSTOM_BUILDPATCHNUM"] = "3";

tmr.run();

// validate the replacement
let actual = (<any>_mockfs).readFileSync('working/file.config', 'utf-8');

var expected = `
<configuration>
  <appSettings>
    <add key="AtSym" value="1.2.3" />
  </appSettings>
</configuration>
`;

if (actual !== expected) {
  console.log(actual);
  console.error("Replacement failed.");
} else {
  console.log("Replacement succeeded!")
}