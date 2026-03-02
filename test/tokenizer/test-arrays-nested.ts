import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
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
var tmpFile = path.join(workingFolder, "nested-arrays.json");

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "findMatch": {
        "nested-arrays.json" : [ tmpFile ]
    }
};
tmr.setAnswers(a);

fs.writeFile(tmpFile, `
{
  "StorageAccounts": [
    {
      "Name": "account1",
      "StorageContainers": [
        {
          "Name": "container1",
          "Path": "/path/1"
        },
        {
          "Name": "container2",
          "Path": "/path/2"
        }
      ]
    }
  ]
}
`, (err) => {

  // set inputs
  tmr.setInput('sourcePath', "working");
  tmr.setInput('filePattern', 'nested-arrays.json');
  tmr.setInput('tokenizeType', 'Json');
  tmr.setInput('includes', ''); 
  tmr.setInput('excludes', '');
  tmr.setInput('nullBehavior', 'warning');

  tmr.run();

  // validate the replacement
  let actual = fs.readFileSync(tmpFile).toString();
  var expected = `
{
  "StorageAccounts": [
    {
      "Name": "__StorageAccounts[0].Name__",
      "StorageContainers": [
        {
          "Name": "__StorageAccounts[0].StorageContainers[0].Name__",
          "Path": "__StorageAccounts[0].StorageContainers[0].Path__"
        },
        {
          "Name": "__StorageAccounts[0].StorageContainers[1].Name__",
          "Path": "__StorageAccounts[0].StorageContainers[1].Path__"
        }
      ]
    }
  ]
}`;

  if (actual.trim() !== expected.trim()) {
    console.log("Actual:");
    console.log(actual);
    console.log("Expected:");
    console.log(expected);
    console.error("Nested array tokenization failed.");
  } else {
    console.log("Nested array tokenization succeeded!")
  }
});
