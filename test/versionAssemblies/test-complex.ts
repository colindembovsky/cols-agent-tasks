import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fse = require('fs-extra');
import mockfs = require('mock-fs');
import assert = require('assert');

let rootDir = path.join(__dirname, '..', 'instrumented');
let taskPath = path.join(rootDir, 'versionAssemblies.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "glob": {
        "working\\AndroidManifest.xml" : [ path.join("working", "AndroidManifest.xml") ]
    }
};
tmr.setAnswers(a);

// mock the fs
let _mockfs = mockfs.fs({
    "working/AndroidManifest.xml": `
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="myHealth.Client.Droid" android:versionCode="1" android:versionName="5.2" android:installLocation="auto">
  <!--suppress UsesMinSdkAttributes-->
  <uses-sdk android:minSdkVersion="15" />
</manifest>
`});
tmr.registerMock('fs', _mockfs);

// set inputs
tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', 'AndroidManifest.xml');
tmr.setInput('buildRegex', '(?:\\d+\\.\\d+\\.)(\\d+)'); 
tmr.setInput('buildRegexIndex', '1'); 
tmr.setInput('replaceRegex', 'versionCode="\\d+'); 
tmr.setInput('replacePrefix', 'versionCode="'); 
tmr.setInput('replacePostfix', '-alpha'); 
tmr.setInput('failIfNoMatchFound', 'false'); 

// set variables
process.env["Build_BuildNumber"] = "5.2.43";

tmr.run();

// validate the replacement
let actual = (<any>_mockfs).readFileSync('working/AndroidManifest.xml', 'utf-8');
var expected = `
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="myHealth.Client.Droid" android:versionCode="43-alpha" android:versionName="5.2" android:installLocation="auto">
  <!--suppress UsesMinSdkAttributes-->
  <uses-sdk android:minSdkVersion="15" />
</manifest>
`;

if (actual !== expected) {
  console.log(actual);
  console.error("Versioning failed.");
} else {
  console.log("Versioning succeeded!")
}