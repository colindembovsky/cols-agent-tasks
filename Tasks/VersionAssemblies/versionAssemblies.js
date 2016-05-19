var tl = require('vso-task-lib/vsotask');
var sh = require('shelljs');
var fs = require('fs');
var os = require('os');
tl.debug("Starting Version Assemblies step");
// get the task vars
var sourcePath = tl.getPathInput("sourcePath", true, true);
var filePattern = tl.getInput("filePattern", true);
var buildRegex = tl.getInput("buildRegex", true);
var buildRegexIndex = tl.getInput("buildRegexIndex", false);
var replaceRegex = tl.getInput("replaceRegex", false);
var replacePrefix = tl.getInput("replacePrefix", false);
var replacePostfix = tl.getInput("replacePostfix", false);
var failIfNoMatchFoundStr = tl.getInput("failIfNoMatchFound", false);
var failIfNoMatchFound = false;
if (failIfNoMatchFoundStr === 'true') {
    failIfNoMatchFound = true;
}
// get the build number from the env vars
var buildNumber = tl.getVariable("Build.BuildNumber");
tl.debug("sourcePath :" + sourcePath);
tl.debug("filePattern : " + filePattern);
tl.debug("buildRegex : " + buildRegex);
tl.debug("buildRegexIndex : " + buildRegexIndex);
tl.debug("replaceRegex : " + replaceRegex);
tl.debug("replacePrefix : " + replacePrefix);
tl.debug("replacePostfix : " + replacePostfix);
tl.debug("failIfNoMatchFound : " + failIfNoMatchFound);
tl.debug("buildNumber : " + buildNumber);
if (replaceRegex === undefined || replaceRegex.length === 0) {
    replaceRegex = buildRegex;
}
tl.debug("Using " + replaceRegex + " as the replacement regex");
if (buildRegexIndex === undefined || buildRegexIndex.length === 0) {
    buildRegexIndex = "0";
}
tl.debug("Using " + buildRegexIndex + " as the build regex index regex");
var separator = os.platform() === "win32" ? "\\" : "/";
var buildRegexObj = new RegExp(buildRegex);
if (buildRegexObj.test(buildNumber)) {
    var versionNum = buildRegexObj.exec(buildNumber)[buildRegexIndex];
    console.info("Using prefix [" + replacePrefix + "] and version [" + versionNum + "] and postfix [" + replacePostfix + "] in folder [" + sourcePath + "]");
    var filesToReplace = tl.glob("" + sourcePath + separator + filePattern);
    if (filesToReplace === undefined || filesToReplace.length === 0) {
        tl.warning("No files found");
    }
    else {
        for (var i = 0; i < filesToReplace.length; i++) {
            var file = filesToReplace[i];
            console.info("Changing version in " + file);
            var contents = fs.readFileSync(file, 'utf8').toString();
            var checkMatches = new RegExp(replaceRegex).exec(contents);
            if (!checkMatches || checkMatches.length === 0) {
                if (failIfNoMatchFound) {
                    tl.error("No matches for regex [" + replaceRegex + "] found in file " + file);
                    process.exit(1);
                }
                else {
                    tl.warning("No matches for regex [" + replaceRegex + "] found in file " + file);
                }
            }
            else {
                console.info(checkMatches.length + " matches for regex [" + replaceRegex + "] found in file " + file);
                // make the file writable
                sh.chmod(666, file);
                // replace all occurrences by adding g to the pattern
                sh.sed("-i", new RegExp(replaceRegex, "g"), replacePrefix + versionNum + replacePostfix, file);
            }
        }
        console.info("Processed " + filesToReplace.length + " files");
    }
}
else {
    tl.warning("Could not extract a version from [" + buildNumber + "] using pattern [" + buildRegex + "]");
}
tl.debug("Leaving Version Assemblies step");
//# sourceMappingURL=versionAssemblies.js.map
