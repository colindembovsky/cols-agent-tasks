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
var tmpFile = path.join(workingFolder, "Info.plist");

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "findMatch": {
        "Info.plist" : [ tmpFile ]
    }
};
tmr.setAnswers(a);

fs.writeFile(tmpFile, `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDisplayName</key>
	<string>YourAppName</string>
	<key>CFBundleIdentifier</key>
	<string>com.example.yourappname</string>
	<key>CFBundleShortVersionString</key>
	<string>2.16.2</string>
	<key>CFBundleVersion</key>
	<string>2.16.2.0</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>MinimumOSVersion</key>
	<string>9.0</string>
	<key>UIDeviceFamily</key>
	<array>
		<integer>2</integer>
	</array>
</dict>
</plist>
`, (err) => {

  // set inputs
  tmr.setInput('sourcePath', "working");
  tmr.setInput('filePattern', 'Info.plist');
  tmr.setInput("versionSource", 'buildNumer');
  tmr.setInput("versionFormat", 'fourParts');
  tmr.setInput("replaceVersionFormat", 'custom');
  tmr.setInput('customReplaceRegex', '<key>CFBundleVersion</key>\\s*<string>.*</string>'); 
  tmr.setInput('replacePrefix', '<key>CFBundleVersion</key>\n\t<string>'); 
  tmr.setInput('replacePostfix', '</string>'); 
  tmr.setInput('failIfNoMatchFound', 'false'); 

  // set variables
  process.env["Build_BuildNumber"] = "5.2.43.112";

  tmr.run();

  // validate the replacement
  let actual = fs.readFileSync(tmpFile).toString();
  var expected = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDisplayName</key>
	<string>YourAppName</string>
	<key>CFBundleIdentifier</key>
	<string>com.example.yourappname</string>
	<key>CFBundleShortVersionString</key>
	<string>2.16.2</string>
	<key>CFBundleVersion</key>
	<string>5.2.43.112</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>MinimumOSVersion</key>
	<string>9.0</string>
	<key>UIDeviceFamily</key>
	<array>
		<integer>2</integer>
	</array>
</dict>
</plist>
`;

  if (actual.trim() !== expected.trim()) {
      console.log(actual);
      console.error("Versioning failed.");
  } else {
      console.log("Versioning succeeded!")
  }
});