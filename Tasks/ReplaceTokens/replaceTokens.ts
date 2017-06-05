import * as tl from 'vsts-task-lib/task';
import * as sh from 'shelljs';
import * as fs from 'fs';
import * as os from 'os';

async function run() {
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
        var tokenRegex = tl.getInput("tokenRegex", true);
        var secretTokenInput = tl.getInput("secretTokens", false);

        // store the tokens and values if there is any secret token input 
        var secretTokens: {[id: string]: string} = {};
        if (secretTokenInput != null && typeof secretTokenInput !== 'undefined') {
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

        var files = tl.findMatch(sourcePath, filePattern);
        if (!files || files.length === 0) {
            var msg = `Could not find files with glob [${filePattern}].`;
            if (os.platform() !== "win32") {
                tl.warning("No files found for pattern. Non-windows file systems are case sensitvive, so check the case of your path and file patterns.");
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
                if (typeof secretTokens[vName.toLowerCase()] !== 'undefined') {
                    // try find the variable in secret tokens input first
                    newContents = newContents.replace(match[0], secretTokens[vName.toLowerCase()]);
                    console.info(`Replaced token [${vName}] with a secret value`);
                } else {
                    // find the variable value in the environment
                    var vValue = tl.getVariable(vName);
                    if (typeof vValue === 'undefined') {
                        tl.warning(`Token [${vName}] does not have an environment value`);
                    } else {
                        newContents = newContents.replace(match[0], vValue);
                        console.info(`Replaced token [${vName }]`);
                    }           
                }
            }
            tl.debug("Writing new values to file...");
            
            // make the file writable
            sh.chmod(666, file);
            fs.writeFileSync(file, newContents);
        }

    } catch (err) {
        let msg = err;
        if (err.message) {
            msg = err.message;
        }
        tl.setResult(tl.TaskResult.Failed, msg);
    }

    tl.debug("Leaving Replace Tokens task");
}

run();