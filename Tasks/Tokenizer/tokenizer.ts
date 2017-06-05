import * as tl from 'vsts-task-lib/task';
import * as sh from 'shelljs';
import * as fs from 'fs';
import * as os from 'os';

function replaceProps(obj: any, parent: string, includeSet: Set<string>, excludeSet: Set<string>) {
    for (let prop of Object.getOwnPropertyNames(obj)) {
        let propPath = parent === '' ? `${prop}` : `${parent}.${prop}`;
        if (obj[prop] instanceof Array) {
            obj[prop].forEach((arrayObj, position) => {
                // if we're already in an array, we need to update the index
                var posOfBracket = propPath.indexOf("[");
                if (posOfBracket > -1) {
                    propPath = propPath.substr(0, posOfBracket);
                }
                // now append the index
                propPath += `[${position}]`;
                replaceProps(arrayObj, propPath, includeSet, excludeSet);
            });
        } else if (typeof (obj[prop]) === 'object') {
            replaceProps(obj[prop], propPath, includeSet, excludeSet);
        } else {
            if ((!includeSet && !excludeSet) ||
                (includeSet && includeSet.has(propPath)) ||
                (excludeSet && !excludeSet.has(propPath))
            ) {
                console.info(`Tokenizing ${propPath}`);
                obj[prop] = `__${propPath}__`;
            }
        }
    }
}

async function run() {
    try {
        tl.debug("Starting Tokenizer task");

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

        // create a glob removing any spurious quotes
        if (os.platform() !== "win32") {
            // replace \ with /
            filePattern = filePattern.replace(/\\/g, "/");
        }

        // get the files
        let files = tl.findMatch(sourcePath, filePattern);
        if (!files || files.length === 0) {
            let msg = `Could not find files with glob [${filePattern}].`;
            if (os.platform() !== "win32") {
                tl.warning("No files found for pattern. Non-windows file systems are case sensitvive, so check the case of your path and file patterns.");
            }
            tl.setResult(tl.TaskResult.Failed, msg);
        }

        // comma-split the include and excludes
        let includeSet: Set<string>, excludeSet: Set<string>;
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

            let contents = fs.readFileSync(file).toString();
            // remove BOM if present
            contents = contents.replace(String.fromCharCode(65279), '');
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
}

run();