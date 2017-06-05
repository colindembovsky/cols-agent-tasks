import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let rootDir = path.join(__dirname, '../../Tasks', 'ReplaceTokens');
let taskPath = path.join(rootDir, 'replaceTokens.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// set up a tmp file for the test
var workingFolder = path.join(__dirname, "working");
if (!fs.existsSync(workingFolder)) {
  fs.mkdirSync(workingFolder);
}
var tmpFile = path.join(workingFolder, "appsettings.config");

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "findMatch": {
        "*.config" : [ tmpFile ]
    }
};
tmr.setAnswers(a);

fs.writeFile(tmpFile, `
<configuration>
  <appSettings>
    <add key="AtSym" value="@@CUSTOM_BUILDMAJORNUM@@.@@CUSTOM_BUILDMINORNUM@@.@@CUSTOM_BUILDPATCHNUM@@" />
  </appSettings>
</configuration>
`,
  (err) => {

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
  let actual = fs.readFileSync(tmpFile).toString();

  var expected = `
<configuration>
  <appSettings>
    <add key="AtSym" value="1.2.3" />
  </appSettings>
</configuration>
  `;

  if (actual.trim() !== expected.trim()) {
    console.log(actual);
    console.error("Replacement failed.");
  } else {
    console.log("Replacement succeeded!")
  }
});