import * as tl from 'azure-pipelines-task-lib/task';
import * as sh from 'shelljs';
import * as fs from 'fs';
import * as os from 'os';
import * as AdmZip from 'adm-zip';
const rimraf = require("rimraf");

async function run() {
    var errCount = 0;
    try {
        tl.debug("Starting Replace Tokens task");

        // get the task vars
        var sourcePath = tl.getPathInput("sourcePath");
        if (!sourcePath || sourcePath.length === 0) {
            sourcePath = tl.getVariable("Build.SourcesDirectory");
        }

        // clear leading and trailing quotes for paths with spaces
        sourcePath = sourcePath.replace(/"/g, "");

        // remove trailing slash
        if (sourcePath.endsWith("\\") || sourcePath.endsWith("/")) {
            tl.debug("Trimming separator off sourcePath");
            sourcePath = sourcePath.substr(0, sourcePath.length - 1);
        }

        tl.checkPath(sourcePath, "sourcePath");

        var filePattern = tl.getInput("filePattern", true);
        var warningsAsErrors = tl.getBoolInput("warningsAsErrors", false);
        var tokenRegex = tl.getInput("tokenRegex", true);
        var secretTokenInput = tl.getInput("secretTokens", false);

        const warning = warningsAsErrors ?
            (message: string) => { tl.error(message); errCount++ } :
            (message: string) => tl.warning(message);

        // store the tokens and values if there is any secret token input
        var secretTokens: {[id: string]: string} = {};
        if (secretTokenInput != null) {
            var inputArray : string[] = secretTokenInput.split(";");
            for (var token of inputArray) {
                if (token.indexOf(":") > -1) {
                    var valArray : string[] = token.split(":");
                    if (valArray.length == 2) {
                        var key = valArray[0].trim().toLowerCase();
                        secretTokens[key] = valArray[1].trim();
                        console.log(`Secret token input found [${key}]`);
                    }
                }
            }
            tl.debug(`secretTokens: found [${Object.keys(secretTokens).length}] tokens`);
        }

        tl.debug(`sourcePath: [${sourcePath}]`);
        tl.debug(`filePattern: [${filePattern}]`);
        tl.debug(`tokenRegex: [${tokenRegex}]`);

        if (!filePattern || filePattern.length === 0){
            filePattern = "*.*";
        }
        tl.debug(`Using [${filePattern}] as filePattern`);

        // create a glob removing any spurious quotes
        if (os.platform() !== "win32") {
            // replace \ with /
            filePattern = filePattern.replace(/\\/g, "/");
        }

        // If the Source Path is a zip file, extract the files so we can work on the files in the zip.
        let sourcePathIsZipFile: boolean = false;
        const sourcePathZipFilePath: string = sourcePath
        const sourcePathZipDirectoryPath: string = sourcePath + "-Extracted";
        if (sourcePath.endsWith(".zip")) {
            sourcePathIsZipFile = true;

            tl.debug(`'${sourcePath}' is a zip file, and it will be extracted to '${sourcePathZipDirectoryPath}'.`);
            const zip = new AdmZip(sourcePath);
            zip.extractAllTo(sourcePathZipDirectoryPath)

            sourcePath = sourcePathZipDirectoryPath
        }

        var files = tl.findMatch(sourcePath, filePattern);
        if (!files || files.length === 0) {
            var msg = `Could not find files with glob [${filePattern}].`;
            if (os.platform() !== "win32") {
                warning("No files found for pattern. Non-windows file systems are case sensitive, so check the case of your path and file patterns.");
            }
            tl.setResult(tl.TaskResult.Failed, msg);
        }
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            console.info(`Starting regex replacement in [${file}]`);

            var contents = fs.readFileSync(file).toString();
            var reg = new RegExp(tokenRegex, "g");

            // loop through each match
            var match: RegExpExecArray;
            // keep a separate var for the contents so that the regex index doesn't get messed up
            // by replacing items underneath it
            var newContents = contents;
            while((match = reg.exec(contents)) !== null) {
                var vName = match[1];
                var vIsArray = vName.endsWith("[]");
                if (vIsArray) {
                    vName = vName.substring(0, vName.length - 2);
                    console.info(`Detected that ${vName} is an array token`);
                }
                if (typeof secretTokens[vName.toLowerCase()] !== 'undefined') {
                    // try find the variable in secret tokens input first
                    newContents = newContents.replace(match[0], secretTokens[vName.toLowerCase()]);
                    console.info(`Replaced token [${vName}] with a secret value`);
                } else {
                    // find the variable value in the environment
                    var vValue = tl.getVariable(vName);

                    if (typeof vValue === 'undefined') {
                        warning(`Token [${vName}] does not have an environment value`);
                    } else {
                        if (vIsArray) {
                            newContents = newContents.replace(match[0], vValue.replace(/,/g, "\",\""));
                        } else {
                            newContents = newContents.replace(match[0], vValue);
                        }
                        console.info(`Replaced token [${vName }]`);
                    }
                }
            }
            tl.debug("Writing new values to file...");

            // make the file writable
            sh.chmod(666, file);
            fs.writeFileSync(file, newContents);
        }

        // If we unzipped files to replace the tokens, zip them back up now that the files have been updated.
        if (sourcePathIsZipFile) {
            tl.debug(`Zipping up directory '${sourcePathZipDirectoryPath}' to file '${sourcePathZipFilePath}'.`)
            const zip = new AdmZip();
            zip.addLocalFolder(sourcePathZipDirectoryPath);
            zip.writeZip(sourcePathZipFilePath);

            tl.debug(`Deleting temp directory '${sourcePathZipDirectoryPath}'.`)
            rimraf(sourcePathZipDirectoryPath, function () { tl.debug(`Temp directory '${sourcePathZipDirectoryPath}' has been deleted.`) });
        }
    } catch (err) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }

    if (errCount > 0) {
        tl.setResult(tl.TaskResult.Failed, "Errors were encountered - please check logs for details.");
    }

    tl.debug("Leaving Replace Tokens task");
}

run();
