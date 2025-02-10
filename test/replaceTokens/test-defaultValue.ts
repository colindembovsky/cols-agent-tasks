import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
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
var tmpFile = path.join(workingFolder, "file.config");

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
    <add key="NoDefault" value="__NoDefault__" />
    <add key="WithDefault" value="__WithDefault__" />
    <add key="CoolKey" value="__CoolKey:1__" />
    <add key="Secret1" value="__Secret1:2qAs4__" />
    <add key="Regex1" value="__Regex1:^.*$__" />
    <add key="SpecialKeys" value="__SpecialKeys:#-/@__" />
    <add key="Regex" value="__Regex:  x * \\  __" />
    <add key="Regex5" value="__Regex5:  x * \\  __" />
    __key__ : __value:dd__
    __key1__ = __value1:dd__
  </appSettings>
</configuration>
`, 
  (err) => {

  // set inputs
  tmr.setInput('sourcePath', "working");
  tmr.setInput('filePattern', '*.config');
  tmr.setInput('tokenRegex', '__(\\w+)(:(?<defaultValue>.*))?__'); 

  // set variables
  process.env["key1"] = "MyCoolKey";
  process.env["value1"] = "supersecret1";
  
  process.env["WithDefault"] = "WithDefault replaced";


  tmr.run();

  // validate the replacement
  let actual = fs.readFileSync(tmpFile).toString();
  var expected = `
<configuration>
  <appSettings>
    <add key="NoDefault" value="__NoDefault__" />
    <add key="WithDefault" value="WithDefault replaced" />
    <add key="CoolKey" value="1" />
    <add key="Secret1" value="2qAs4" />
    <add key="Regex1" value="^.*$" />
    <add key="SpecialKeys" value="#-/@" />
    <add key="Regex" value="x * \\" />
    <add key="Regex5" value="x * \\" />
    __key__ : dd
    MyCoolKey = supersecret1
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
