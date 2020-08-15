import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import fs = require('fs');
import * as AdmZip from 'adm-zip';

let rootDir = path.join(__dirname, '../../Tasks', 'ReplaceTokens');
let taskPath = path.join(rootDir, 'replaceTokens.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// set up a tmp file for the test
var workingFolder = path.join(__dirname, "working");
if (!fs.existsSync(workingFolder)) {
  fs.mkdirSync(workingFolder);
}
var tmpFile = path.join(workingFolder, "file.config");

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath": {
        "working": true
    },
    "findMatch": {
        "*.config" : [ tmpFile ]
    }
};
tmr.setAnswers(a);

fs.writeFile(tmpFile, `
<configuration>
  <appSettings>
    <add key="CoolKey" value="__CoolKey__" />
    <add key="Secret1" value="__Secret1__" />
  </appSettings>
</configuration>
`,
    (err) => {

        // Zip up file to be token replaced.
        let zipFilePath = path.join(workingFolder, "Archive.zip");
        const zip = new AdmZip();
        zip.addLocalFile(tmpFile);
        zip.writeZip(zipFilePath)

        // set inputs
        tmr.setInput('sourcePath', "working/Archive.zip");
        tmr.setInput('filePattern', '*.config');
        tmr.setInput('tokenRegex', '__(\\w+)__');

        // set variables
        process.env["COOLKEY"] = "MyCoolKey";
        process.env["SECRET_Secret1"] = "supersecret1";

        tmr.run();

        // Unzip the file so we can make sure the tokens were replaced properly.
        let unzipDirectoryPath = path.join(workingFolder, "Replaced");
        const unzip = new AdmZip(zipFilePath);
		unzip.extractAllTo(unzipDirectoryPath)
        let replacedFilePath = path.join(unzipDirectoryPath, "file.config")

        // validate the replacement
        let actual = fs.readFileSync(replacedFilePath).toString();
        var expected = `
<configuration>
  <appSettings>
    <add key="CoolKey" value="MyCoolKey" />
    <add key="Secret1" value="supersecret1" />
  </appSettings>
</configuration>
        `;

        if (actual.trim() !== expected.trim()) {
            console.log(actual);
            console.error("Replacement failed.");
        } else {
            console.log("Replacement succeeded!")
        }
    }
);
