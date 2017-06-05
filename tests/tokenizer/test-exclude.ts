import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let rootDir = path.join(__dirname, '../../Tasks', 'Tokenizer');
let taskPath = path.join(rootDir, 'tokenizer.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// set up a tmp file for the test
var workingFolder = path.join(__dirname, "working");
if (!fs.existsSync(workingFolder)) {
  fs.mkdirSync(workingFolder);
}
var tmpFile = path.join(workingFolder, "appsettings.json");

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "findMatch": {
         "appsettings.json" : [ tmpFile ]
    }
};
tmr.setAnswers(a);

// mock the fs
fs.writeFile(tmpFile, `
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
      "Default": "Debug"
    }
  }
}
`, (err) => {

  // set inputs
  tmr.setInput('sourcePath', "working");
  tmr.setInput('filePattern', 'appsettings.json');
  tmr.setInput('tokenizeType', 'Json');
  tmr.setInput('includes', ''); 
  tmr.setInput('excludes', 'Logging.IncludeScopes');

  tmr.run();

  // validate the replacement
  let actual = fs.readFileSync(tmpFile).toString();
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
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "__Logging.LogLevel.Default__"
    }
  }
}`;

  if (actual.trim() !== expected.trim()) {
    console.log(actual);
    console.error("Tokenization failed.");
  } else {
    console.log("Tokenization succeeded!")
  }
});