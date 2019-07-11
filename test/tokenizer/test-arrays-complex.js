"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
const fs = require("fs");
let rootDir = path.join(__dirname, '../../Tasks', 'Tokenizer');
let taskPath = path.join(rootDir, 'tokenizer.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// set up a tmp file for the test
var workingFolder = path.join(__dirname, "working");
if (!fs.existsSync(workingFolder)) {
    fs.mkdirSync(workingFolder);
}
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
fs.writeFile(tmpFile, `
{
  "defaultAssembly": "WebApi",
  "modules": [
    {
      "type": "WebApi.Infrastucture.ContainerModules.DataModule, WebApi",
      "parameters": {
        "connectionString": "",
        "defaultSchema": ""
      }
    },
    {
      "type": "WebApi.Infrastucture.ContainerModules.MediatorModule, WebApi"
    }
  ],
  "Auth": {
    "ClientSecret": "",
    "ValidAudiences": [
      {
        "foo": "bar",
        "zoo": "zar"
      }
    ],
    "ConnectionStringKVSecretName": ""
  }
}
`, (err) => {
    // set inputs
    tmr.setInput('sourcePath', "working");
    tmr.setInput('filePattern', 'appsettings.json');
    tmr.setInput('tokenizeType', 'Json');
    tmr.setInput('includes', '');
    tmr.setInput('excludes', '');
    tmr.setInput('nullBehavior', 'warning');
    tmr.run();
    // validate the replacement
    let actual = fs.readFileSync(tmpFile).toString();
    var expected = `
{
  "defaultAssembly": "__defaultAssembly__",
  "modules": [
    {
      "type": "__modules[0].type__",
      "parameters": {
        "connectionString": "__modules[0].parameters.connectionString__",
        "defaultSchema": "__modules[0].parameters.defaultSchema__"
      }
    },
    {
      "type": "__modules[1].type__"
    }
  ],
  "Auth": {
    "ClientSecret": "__Auth.ClientSecret__",
    "ValidAudiences": [
      {
        "foo": "__Auth.ValidAudiences[0].foo__",
        "zoo": "__Auth.ValidAudiences[0].zoo__"
      }
    ],
    "ConnectionStringKVSecretName": "__Auth.ConnectionStringKVSecretName__"
  }
}`;
    if (actual.trim() !== expected.trim()) {
        console.log(actual);
        console.error("Tokenization failed.");
    }
    else {
        console.log("Tokenization succeeded!");
    }
});
//# sourceMappingURL=test-arrays-complex.js.map