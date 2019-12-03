import * as tl from 'azure-pipelines-task-lib/task';
import * as sh from 'shelljs';
import * as fs from 'fs';
import * as os from 'os';

async function run() {
    try {
        tl.debug("Starting Version Assemblies step");

        // get the task lets
        let filePattern = tl.getInput("filePattern", true);
        let versionSource = tl.getInput("versionSource", true);
        let versionFormat = tl.getInput("versionFormat", true);
        let customNumberVariable = tl.getInput("customNumberVariable", false);
        let customBuildRegex = tl.getInput("customBuildRegex", false);
        let buildRegexIndex = tl.getInput("buildRegexIndex", false);
        let replaceVersionFormat = tl.getInput("replaceVersionFormat", true);
        let customReplaceRegex = tl.getInput("customReplaceRegex", false);
        let replacePrefix = tl.getInput("replacePrefix", false);
        let replacePostfix = tl.getInput("replacePostfix", false);
        let failIfNoMatchFound = tl.getBoolInput("failIfNoMatchFound", false);

        let sourcePath = tl.getPathInput("sourcePath");
        if (!sourcePath || sourcePath.length === 0) {
            sourcePath = tl.getVariable("Build.SourcesDirectory");
        }
        tl.checkPath(sourcePath, "sourcePath");
        // clear leading and trailing quotes for paths with spaces
        sourcePath = sourcePath.replace(/"/g, "");

        // get the build number from the env lets
        let buildNumber = tl.getVariable("Build.BuildNumber");

        // these will be null if not specified - change to empty string
        if (!replacePrefix) replacePrefix = "";
        if (!replacePostfix) replacePostfix = "";

        tl.debug(`replacePrefix: ${replacePrefix}`);
        tl.debug(`replacePostfix: ${replacePostfix}`);
        tl.debug(`buildNumber: ${buildNumber}`);

        let buildRegex;
        switch (versionFormat) {
            default:
            case "fourParts": buildRegex = "\\d+\\.\\d+\\.\\d+\\.\\d+"; break;
            case "threeParts": buildRegex = "\\d+\\.\\d+\\.\\d+"; break;
            case "custom": buildRegex = customBuildRegex; break;
        }
        let replaceRegex;
        switch (replaceVersionFormat) {
            default:
            case "fourParts": replaceRegex = "\\d+\\.\\d+\\.\\d+\\.\\d+"; break;
            case "threeParts": replaceRegex = "\\d+\\.\\d+\\.\\d+"; break;
            case "custom": replaceRegex = customReplaceRegex; break;
        }

        tl.debug(`Using ${buildRegex} as the build regex`);
        tl.debug(`Using ${replaceRegex} as the replacement regex`);

        if (!buildRegexIndex || buildRegexIndex.length === 0){
            buildRegexIndex = "0";
        }
        tl.debug(`Using ${buildRegexIndex} as the build regex group index`);

        let versionNum = "";
        let skip = false;
        switch (versionSource) {
            case "variable": {
                versionNum = tl.getVariable(customNumberVariable);
                console.info(`Using ${versionNum} for the custom version number`);
                break;
            }
            default:
            case "buildNumber": {
                let buildRegexObj = new RegExp(buildRegex);
                if (buildRegexObj.test(buildNumber)) {
                    versionNum = buildRegexObj.exec(buildNumber)[buildRegexIndex];
                } else {
                    skip = true;
                    tl.warning(`Could not extract a version from [${buildNumber}] using pattern [${buildRegex}]`);
                }
                break;
            }
        }

        if (!skip) {
            console.info(`Using prefix [${replacePrefix}] and version [${versionNum}] and postfix [${replacePostfix}] in folder [${sourcePath}]`);
            
            if (os.platform() !== "win32") {
                // replace \ with /
                filePattern = filePattern.replace(/\\/g, "/");
            }
            let filesToReplace = tl.findMatch(sourcePath, filePattern);
            
            if (!filesToReplace || filesToReplace.length === 0) {
                tl.warning("No files found");
            } else {
                for (let i = 0; i < filesToReplace.length; i++) {
                    let file = filesToReplace[i];
                    console.info(`Changing version in ${file}`);
                    
                    let contents = fs.readFileSync(file, 'utf8').toString();
                    let checkMatches = new RegExp(replaceRegex).exec(contents);
                    if (!checkMatches || checkMatches.length === 0) {
                        if (failIfNoMatchFound) {
                            tl.setResult(tl.TaskResult.Failed, `No matches for regex [${replaceRegex}] found in file ${file}`);
                            process.exit(1);
                        } else {
                            tl.warning(`No matches for regex [${replaceRegex}] found in file ${file}`);
                        }
                    } else {
                        console.info(`${checkMatches.length} matches for regex [${replaceRegex}] found in file ${file}`);
                        
                        let replaceVal = replacePrefix + versionNum + replacePostfix;
                        let result = contents.replace(new RegExp(replaceRegex, "g"), replaceVal);
                        
                        // make the file writable
                        sh.chmod(666, file);
                        fs.writeFileSync(file, result, { encoding: 'utf8' });
                    }
                }
                console.info(`Processed ${filesToReplace.length} files`);
            }
        }
    }
    catch (err) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }

    tl.debug("Leaving Version Assemblies step");
}

run();