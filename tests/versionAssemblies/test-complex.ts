import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');

let rootDir = path.join(__dirname, '../../Tasks', 'VersionAssemblies');
let taskPath = path.join(rootDir, 'versionAssemblies.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// set up a tmp file for the test
var workingFolder = path.join(__dirname, "working");
if (!fs.existsSync(workingFolder)) {
  fs.mkdirSync(workingFolder);
}
var tmpFile = path.join(workingFolder, "AndroidManifest.xml");

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "findMatch": {
        "AndroidManifest.xml" : [ tmpFile ]
    }
};
tmr.setAnswers(a);

fs.writeFile(tmpFile, `
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="myHealth.Client.Droid" android:versionCode="1" android:versionName="5.2" android:installLocation="auto">
  <!--suppress UsesMinSdkAttributes-->
  <uses-sdk android:minSdkVersion="15" />
</manifest>
`, (err) => {

  // set inputs
  tmr.setInput('sourcePath', "working");
  tmr.setInput('filePattern', 'AndroidManifest.xml');
  tmr.setInput("versionSource", 'buildNumer');
  tmr.setInput("versionFormat", 'custom');
  tmr.setInput("replaceVersionFormat", 'custom');
  tmr.setInput('customBuildRegex', '(?:\\d+\\.\\d+\\.)(\\d+)'); 
  tmr.setInput('buildRegexIndex', '1');
  tmr.setInput('customReplaceRegex', 'versionCode="\\d+'); 
  tmr.setInput('replacePrefix', 'versionCode="'); 
  tmr.setInput('replacePostfix', '-alpha'); 
  tmr.setInput('failIfNoMatchFound', 'false'); 

  // set variables
  process.env["Build_BuildNumber"] = "5.2.43";

  tmr.run();

  // validate the replacement
  let actual = fs.readFileSync(tmpFile).toString();
  var expected = `
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="myHealth.Client.Droid" android:versionCode="43-alpha" android:versionName="5.2" android:installLocation="auto">
  <!--suppress UsesMinSdkAttributes-->
  <uses-sdk android:minSdkVersion="15" />
</manifest>
  `;

  if (actual.trim() !== expected.trim()) {
      console.log(actual);
      console.error("Versioning failed.");
  } else {
      console.log("Versioning succeeded!")
  }
});