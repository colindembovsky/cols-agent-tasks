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
var tmpFile = path.join(workingFolder, "file.json");

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "findMatch": {
        "*.json" : [ tmpFile ]
    }
};
tmr.setAnswers(a);

fs.writeFile(tmpFile, `
{
  "Auth": {
    "ClientSecret": "Secret",
    "ValidAudiences": [
      "__Auth.ValidAudiences[]__"
    ],
    "ConnectionStringKVSecretName": "__Auth.CS__"
  }
}
`, 
  (err) => {

  // set inputs
  tmr.setInput('sourcePath', "working");
  tmr.setInput('filePattern', '*.json');
  tmr.setInput('tokenRegex', '__(\\w+[\\.\\w+]*\\[?\\]?)__'); 

  // set variables
  process.env["AUTH_VALIDAUDIENCES"] = "a,b,c";
  process.env["AUTH_CS"] = "someval";

  tmr.run();

  // validate the replacement
  let actual = fs.readFileSync(tmpFile).toString();
  var expected = `
{
  "Auth": {
    "ClientSecret": "Secret",
    "ValidAudiences": [
      "a","b","c"
    ],
    "ConnectionStringKVSecretName": "someval"
  }
}
`;

  if (actual.trim() !== expected.trim()) {
    console.log(actual);
    console.error("Replacement failed.");
  } else {
    console.log("Replacement succeeded!")
  }
});
