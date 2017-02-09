"use strict";
const tmrm = require('vsts-task-lib/mock-run');
const path = require('path');
const mockfs = require('mock-fs');
let rootDir = path.join(__dirname, '..', 'instrumented');
let taskPath = path.join(rootDir, 'tokenizer.js');
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
    "working/appsettings.json": `
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
  ]
}
` });
tmr.registerMock('fs', _mockfs);
// set inputs
tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', 'appsettings.json');
tmr.setInput('tokenizeType', 'Json');
tmr.setInput('includes', '');
tmr.setInput('excludes', '');
tmr.run();
// validate the replacement
let actual = _mockfs.readFileSync('working/appsettings.json', 'utf-8');
var expected = `{
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
  ]
}`;
if (actual !== expected) {
    console.log(actual);
    console.error("Tokenization failed.");
}
else {
    console.log("Tokenization succeeded!");
}
//# sourceMappingURL=test-array.js.map