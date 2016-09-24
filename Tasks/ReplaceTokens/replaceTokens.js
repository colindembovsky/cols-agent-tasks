var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
import * as tl from 'vsts-task-lib/task';
import * as sh from 'shelljs';
import * as fs from 'fs';
import * as os from 'os';
function run() {
    return __awaiter(this, void 0, Promise, function* () {
        try {
            tl.debug("Starting Replace Tokens task");
            // get the task vars
            var sourcePath = tl.getPathInput("sourcePath", true, true);
            // clear leading and trailing quotes for paths with spaces
            sourcePath = sourcePath.replace(/"/g, "");
            var filePattern = tl.getInput("filePattern", true);
            var tokenRegex = tl.getInput("tokenRegex", true);
            var secretTokenInput = tl.getInput("secretTokens", false);
            // store the tokens and values if there is any secret token input 
            var secretTokens = {};
            if (secretTokenInput != null && typeof secretTokenInput !== 'undefined') {
                var inputArray = secretTokenInput.split(";");
                for (var token of inputArray) {
                    if (token.indexOf(":") > -1) {
                        var valArray = token.split(":");
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
            if (!filePattern || filePattern.length === 0) {
                filePattern = "*.*";
            }
            tl.debug(`Using [${filePattern}] as filePattern`);
            var separator = os.platform() === "win32" ? "\\" : "/";
            // create a glob removing any spurious quotes
            var globPattern = `${sourcePath}${separator}${filePattern}`.replace(/\"/g, "");
            if (os.platform() !== "win32") {
                // replace \ with /
                globPattern = globPattern.replace(/\\/g, "/");
            }
            var files = tl.glob(globPattern);
            if (!files || files.length === 0) {
                var msg = `Could not find files with glob [${globPattern}].`;
                if (os.platform() !== "win32") {
                    tl.warning("No files found for pattern. Non-windows file systems are case sensitvive, so check the case of your path and file patterns.");
                }
                tl.setResult(tl.TaskResult.Failed, msg);
            }
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.info(`Starting regex replacement in [${file}]`);
                var contents = fs.readFileSync(file, 'utf8').toString();
                var reg = new RegExp(tokenRegex, "g");
                // loop through each match
                var match;
                while ((match = reg.exec(contents)) !== null) {
                    var vName = match[1];
                    if (typeof secretTokens[vName.toLowerCase()] !== 'undefined') {
                        // try find the variable in secret tokens input first
                        contents = contents.replace(match[0], secretTokens[vName.toLowerCase()]);
                        console.info(`Replaced token [${vName}] with a secret value`);
                    }
                    else {
                        // find the variable value in the environment
                        var vValue = tl.getVariable(vName);
                        if (typeof vValue === 'undefined') {
                            tl.warning(`Token [${vName}] does not have an environment value`);
                        }
                        else {
                            contents = contents.replace(match[0], vValue);
                            console.info(`Replaced token [${vName}]`);
                        }
                    }
                }
                tl.debug("Writing new values to file...");
                // make the file writable
                sh.chmod(666, file);
                fs.writeFileSync(file, contents);
            }
            tl.debug("Leaving Replace Tokens task");
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
//# sourceMappingURL=replaceTokens.js.map