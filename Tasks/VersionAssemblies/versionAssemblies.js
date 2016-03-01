var tl = require('vso-task-lib/vsotask');
var sh = require('shelljs');
tl.debug("Starting Version Assemblies step");
// get the task vars
var sourcePath = tl.getPathInput("sourcePath", true, true);
var filePattern = tl.getInput("filePattern", true);
var buildRegex = tl.getInput("buildRegex", true);
var buildRegexIndex = tl.getInput("buildRegexIndex", false);
var replaceRegex = tl.getInput("replaceRegex", false);
var replacePrefix = tl.getInput("replacePrefix", false);
// get the build number from the env vars
var buildNumber = tl.getVariable("Build.BuildNumber");
tl.debug("sourcePath :" + sourcePath);
tl.debug("filePattern : " + filePattern);
tl.debug("buildRegex : " + buildRegex);
tl.debug("buildRegexIndex : " + buildRegexIndex);
tl.debug("replaceRegex : " + replaceRegex);
tl.debug("replacePrefix : " + replacePrefix);
tl.debug("buildNumber : " + buildNumber);
if (replaceRegex === undefined || replaceRegex.length === 0) {
    replaceRegex = buildRegex;
}
tl.debug("Using " + replaceRegex + " as the replacement regex");
if (buildRegexIndex === undefined || buildRegexIndex.length === 0) {
    buildRegexIndex = "0";
}
tl.debug("Using " + buildRegexIndex + " as the build regex index regex");
var buildRegexObj = new RegExp(buildRegex);
if (buildRegexObj.test(buildNumber)) {
    var versionNum = buildRegexObj.exec(buildNumber)[buildRegexIndex];
    console.info("Using prefix [" + replacePrefix + "] and version [" + versionNum + "] in folder [" + sourcePath + "]");
    // get a list of all files under this root
    var allFiles = tl.find(sourcePath);
    // Now matching the pattern against all files
    var filesToReplace = tl.match(allFiles, filePattern, { matchBase: true });
    if (filesToReplace === undefined || filesToReplace.length === 0) {
        tl.warning("No files found");
    }
    else {
        for (var i = 0; i < filesToReplace.length; i++) {
            var file = filesToReplace[i];
            console.info("  -> Changing version in " + file);
            // replace all occurrences by adding g to the pattern
            sh.sed("-i", new RegExp(replaceRegex, "g"), replacePrefix + versionNum, file);
        }
        console.info("Replaced version in " + filesToReplace.length + " files");
    }
}
else {
    tl.warning("Could not extract a version from [" + buildNumber + "] using pattern [" + buildRegex + "]");
}
tl.debug("Leaving Version Assemblies step");
//# sourceMappingURL=versionAssemblies.js.map