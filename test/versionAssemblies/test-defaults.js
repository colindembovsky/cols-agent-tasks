"use strict";
const tmrm = require('vsts-task-lib/mock-run');
const path = require('path');
const mockfs = require('mock-fs');
var testRoot = path.resolve(__dirname);
let taskPath = path.join(__dirname, '..', '..', 'Tasks', 'VersionAssemblies', 'VersionAssemblies.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
// provide answers for task mock
let a = {
    "checkPath": {
        "working": true
    },
    "glob": {
        "working\\**\\AssemblyInfo.*": [path.join("working", "AssemblyInfo.cs")]
    }
};
tmr.setAnswers(a);
// mock the fs
let _mockfs = mockfs.fs({
    "working/AssemblyInfo.cs": `
[assembly: AssemblyTitle("TestAsm")]
[assembly: AssemblyProduct("TestAsm")]
[assembly: AssemblyCopyright("Copyright © 2016")]
// The following GUID is for the ID of the typelib if this project is exposed to COM
[assembly: Guid("994fa927-3e6f-4794-a442-5003ca450d2b")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]
` });
tmr.registerMock('fs', _mockfs);
// set inputs
tmr.setInput('sourcePath', "working");
tmr.setInput('filePattern', '**\\AssemblyInfo.*');
tmr.setInput('buildRegex', '\\d+\\.\\d+\\.\\d+\\.\\d+');
tmr.setInput('buildRegexIndex', '0');
tmr.setInput('replaceRegex', '');
tmr.setInput('replacePrefix', '');
tmr.setInput('replacePostfix', '');
tmr.setInput('failIfNoMatchFound', 'false');
// set variables
process.env["Build_BuildNumber"] = "1.5.2.3";
tmr.run();
// validate the replacement
let actual = _mockfs.readFileSync('working/AssemblyInfo.cs', 'utf-8');
var expected = `
[assembly: AssemblyTitle("TestAsm")]
[assembly: AssemblyProduct("TestAsm")]
[assembly: AssemblyCopyright("Copyright © 2016")]
// The following GUID is for the ID of the typelib if this project is exposed to COM
[assembly: Guid("994fa927-3e6f-4794-a442-5003ca450d2b")]
[assembly: AssemblyVersion("1.5.2.3")]
[assembly: AssemblyFileVersion("1.5.2.3")]
`;
if (actual !== expected) {
    console.log(actual);
    console.error("Versioning failed.");
}
else {
    console.log("Versioning succeeded!");
}
//# sourceMappingURL=test-defaults.js.map