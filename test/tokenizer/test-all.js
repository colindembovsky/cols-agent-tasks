"use strict";
const tmrm = require('vsts-task-lib/mock-run');
const path = require('path');
const mockfs = require('mock-fs');
var testRoot = path.resolve(__dirname);
let taskPath = path.join(__dirname, '..', '..', 'Tasks', 'Tokenizer', 'tokenizer.js');
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
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\\\mssqllocaldb;Database=aspnet-WebApplication1-26e8893e-d7c0-4fc6-8aab-29b59971d622;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "Tricky": {
    "Tricky": "Tricky",
    "Tricky1": {
        "Tricky2": "Tricky"
    }
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
  "ConnectionStrings": {
    "DefaultConnection": "__ConnectionStrings.DefaultConnection__"
  },
  "Tricky": {
    "Tricky": "__Tricky.Tricky__",
    "Tricky1": {
      "Tricky2": "__Tricky.Tricky1.Tricky2__"
    }
  },
  "Logging": {
    "IncludeScopes": "__Logging.IncludeScopes__",
    "LogLevel": {
      "Default": "__Logging.LogLevel.Default__",
      "System": "__Logging.LogLevel.System__",
      "Microsoft": ""__Logging.LogLevel.Microsoft__"
    }
  }
}`;
if (actual !== expected) {
    console.log(actual);
    console.error("Tokenization failed.");
}
else {
    console.log("Tokenization succeeded!");
}
//# sourceMappingURL=test-all.js.map