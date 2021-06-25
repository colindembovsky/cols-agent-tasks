import * as tl from 'azure-pipelines-task-lib/task';
import * as sh from 'shelljs';
import * as fs from 'fs';
import * as os from 'os';

function shouldReplaceProp(includeSet: Set<string>, excludeSet: Set<string>, propPath: string) {
    return (!includeSet && !excludeSet) ||
        (includeSet && includeSet.has(propPath)) ||
        (excludeSet && !excludeSet.has(propPath));
}

function arrayIsPrimitiveArray(item: any[]) {
    // if `i === Object(i)` then i is a primitive
    return item.every(p => { 
        console.info(`-----> Checking ${p}`); 
        let isPrimitive = p !== Object(p);
        console.info(`-----> isPrim? ${isPrimitive}`); 
        return isPrimitive;
    });
}

function replaceProps(nullBehavior: string, obj: any, parent: string, includeSet: Set<string>, excludeSet: Set<string>) {
    let success = true;
    for (let prop of Object.keys(obj)) {
        let propPath = parent === '' ? `${prop}` : `${parent}.${prop}`;

        if (obj[prop] == null) {
            let msg = `Property ${propPath} is null`;
            if (nullBehavior === "warning") {
                tl.warning(msg);
            } else {
                tl.error(msg);
                success = false;
            }
            continue;
        }

        let propType = typeof (obj[prop])
        console.info(`${propPath} has typeof ${propType}`)
        if (obj[prop] instanceof Array) {
            if (arrayIsPrimitiveArray(obj[prop])) {
                console.info(`${propPath} is a primitive array`);
                if (shouldReplaceProp(includeSet, excludeSet, propPath)) {
                    console.info(`Tokenizing ${propPath}`);
                    obj[prop] = [`__${propPath}[]__`];
                } else {
                    console.info(`Skipping ${propPath}`);
                }
            }
            else {
                console.info(`${propPath} is a complex array`);
                obj[prop].forEach((arrayObj, position) => {
                    // if we're already in an array, we need to update the index
                    var posOfBracket = propPath.indexOf("[");
                    if (posOfBracket > -1) {
                        propPath = propPath.substr(0, posOfBracket);
                    }
                    
                    // now append the index
                    propPath += `[${position}]`;
                    success = success && replaceProps(nullBehavior, arrayObj, propPath, includeSet, excludeSet);
                });
            }
        } else if (typeof (obj[prop]) === 'object') {
            success = success && replaceProps(nullBehavior, obj[prop], propPath, includeSet, excludeSet);
        } else {
            if (shouldReplaceProp(includeSet, excludeSet, propPath)) {
                console.info(`Tokenizing ${propPath}`);
                const type = typeof(obj[prop]);
                obj[prop] = `${type}__${propPath}__`;
            }
        }
    }
    return success;
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
        let nullBehavior = tl.getInput("nullBehavior", true);

        tl.debug(`sourcePath: [${sourcePath}]`);
        tl.debug(`filePattern: [${filePattern}]`);
        tl.debug(`tokenizeType: [${tokenizeType}]`);
        tl.debug(`includes: [${includes}]`);
        tl.debug(`excludes: [${excludes}]`);
        tl.debug(`nullBehavior: [${nullBehavior}]`);

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
            console.info(`Starting tokenization in [${file}]!`);

            let contents = fs.readFileSync(file).toString();
            // remove BOM if present
            contents = contents.replace(String.fromCharCode(65279), '');
                    
            // if something has been tokenized before so there is invalid json, add it to the includeSet and set it to false so it gets tokenzed back
            contents.match(/: __.*?__/g)
                ?.map(match => match.replace(': ', ''))
                .forEach(match => {
                    contents = contents.replace(match, 'false');
                    includeSet.add(match.replace(/__/g, ''));
                });  
            
            let json = JSON.parse(contents);

            // find the include properties recursively
            let success = replaceProps(nullBehavior, json, '', includeSet, excludeSet);
            if (!success) {
                throw "Tokenization failed - please check previous logs.";
            }

            tl.debug("Writing new values to file...");
            // make the file writable
            sh.chmod(666, file);
            var content = JSON.stringify(json, null, 2)
                .replace(/"string(.*?)"/g, '"$1"')
                .replace(/"boolean(.*?)"/g, '$1')
                .replace(/"number(.*?)"/g, '$1');
            fs.writeFileSync(file, content);  
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
