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
        "working\\appsettings.json" : [ path.join("working", "appsettings.json") ]
    }
};
tmr.setAnswers(a);

// mock the fs
let _mockfs = mockfs.fs({
    "working/appsettings.json": `
{
  "ConnectionStrings": {
    "DefaultConnection": "__ConnectionStrings.DefaultConnection__"
  },
  "Tricky": {
    "Gollum": "__Tricky.Gollum__",
    "Hobbit": "__Tricky.Hobbit__"
  },
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Debug",
      "System": "Information",
      "Microsoft": "Information"
    }
  }
}
`});
tmr.registerMock('fs', _mockfs);

// set inputs
tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', 'appsettings.json');
tmr.setInput('tokenRegex', '__(\\w+[\\.\\w+]*)__'); 

// set variables
process.env["ConnectionStrings_DefaultConnection"] = "testing";
process.env["Tricky_Gollum"] = "Gollum2";
process.env["Tricky_Hobbit"] = "Sam";

tmr.run();

// validate the replacement
let actual = (<any>_mockfs).readFileSync('working/appsettings.json', 'utf-8');

var expected = `
{
  "ConnectionStrings": {
    "DefaultConnection": "testing"
  },
  "Tricky": {
    "Gollum": "Gollum2",
    "Hobbit": "Sam"
  },
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Debug",
      "System": "Information",
      "Microsoft": "Information"
    }
  }
}
`;

if (actual !== expected) {
  console.log(actual);
  console.error("Replacement failed.");
} else {
  console.log("Replacement succeeded!")
}