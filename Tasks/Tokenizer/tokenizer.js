"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const tl = require('vsts-task-lib/task');
const sh = require('shelljs');
const fs = require('fs');
const os = require('os');
// Object.resolve = function(path, obj) {
//     return path.split('.').reduce(function(prev, curr) {
//         return prev ? prev[curr] : undefined
//     }, obj || self)
// }
function replaceProps(obj, parent, includeSet, excludeSet) {
    for (let prop of Object.getOwnPropertyNames(obj)) {
        let propPath = parent === '' ? `${prop}` : `${parent}.${prop}`;
        if (typeof (obj[prop]) === 'object') {
            replaceProps(obj[prop], propPath, includeSet, excludeSet);
        }
        else {
            if ((!includeSet && !excludeSet) ||
                (includeSet && includeSet.has(propPath)) ||
                (excludeSet && !excludeSet.has(propPath))) {
                console.info(`Tokenizing ${propPath}`);
                obj[prop] = `__${propPath}__`;
            }
        }
    }
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.debug("Starting Tokenizer task");
            // get the task vars
            let sourcePath = tl.getPathInput("sourcePath", true, true);
            // clear leading and trailing quotes for paths with spaces
            sourcePath = sourcePath.replace(/"/g, "");
            let filePattern = tl.getInput("filePattern", true);
            let tokenizeType = tl.getInput("tokenizeType", true);
            let includes = tl.getInput("includes", false);
            let excludes = tl.getInput("excludes", false);
            if (!includes) {
                includes = '';
            }
            if (!excludes) {
                excludes = '';
            }
            tl.debug(`sourcePath: [${sourcePath}]`);
            tl.debug(`filePattern: [${filePattern}]`);
            tl.debug(`tokenizeType: [${tokenizeType}]`);
            tl.debug(`includes: [${includes}]`);
            tl.debug(`excludes: [${excludes}]`);
            // only one or the other can be specified
            if (includes && includes.length > 0 && excludes && excludes.length > 0) {
                throw `You cannot specify includes and excludes - please specify one or the other`;
            }
            if (!filePattern || filePattern.length === 0) {
                filePattern = "*.*";
            }
            tl.debug(`Using [${filePattern}] as filePattern`);
            let separator = os.platform() === "win32" ? "\\" : "/";
            // create a glob removing any spurious quotes
            let globPattern = `${sourcePath}${separator}${filePattern}`.replace(/\"/g, "");
            if (os.platform() !== "win32") {
                // replace \ with /
                globPattern = globPattern.replace(/\\/g, "/");
            }
            // get the files
            let files = tl.glob(globPattern);
            if (!files || files.length === 0) {
                let msg = `Could not find files with glob [${globPattern}].`;
                if (os.platform() !== "win32") {
                    tl.warning("No files found for pattern. Non-windows file systems are case sensitvive, so check the case of your path and file patterns.");
                }
                tl.setResult(tl.TaskResult.Failed, msg);
            }
            // comma-split the include and excludes
            let includeSet, excludeSet;
            if (includes && includes.length > 0) {
                includeSet = new Set(includes.split(','));
                tl.debug(`Includeset has ${includeSet.size} elements`);
            }
            if (excludes && excludes.length > 0) {
                excludeSet = new Set(excludes.split(','));
                tl.debug(`Excludeset has ${excludeSet.size} elements`);
            }
            for (var i = 0; i < files.length; i++) {
                let file = files[i];
                console.info(`Starting tokenization in [${file}]`);
                let contents = fs.readFileSync(file, 'utf8').toString();
                // replace \ with \\
                contents = contents.replace(/\\/, "\\\\");
                let json = JSON.parse(contents);
                // find the include properties recursively
                replaceProps(json, '', includeSet, excludeSet);
                tl.debug("Writing new values to file...");
                // make the file writable
                sh.chmod(666, file);
                fs.writeFileSync(file, JSON.stringify(json, null, 2));
            }
        }
        catch (err) {
            let msg = err;
            if (err.message) {
                msg = err.message;
            }
            tl.setResult(tl.TaskResult.Failed, msg);
        }
        tl.debug("Leaving Tokenize task");
    });
}
run();
//# sourceMappingURL=tokenizer.js.map