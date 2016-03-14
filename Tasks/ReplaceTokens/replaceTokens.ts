import * as tl from 'vso-task-lib';
import * as sh from 'shelljs';
import * as fs from 'fs';

tl.debug("Starting Replace Tokens step");

// get the task vars
var sourcePath = tl.getPathInput("sourcePath", true, true);
var filePattern = tl.getInput("filePattern", true);
var tokenRegex = tl.getInput("tokenRegex", true);

tl.debug(`sourcePath :${sourcePath}`);
tl.debug(`filePattern : ${filePattern}`);
tl.debug(`tokenRegex : ${tokenRegex}`);

if (filePattern === undefined || filePattern.length === 0){
	filePattern = "*.*";
}
tl.debug(`Using ${filePattern} as filePattern`);

var files = tl.glob(`${sourcePath}\\${filePattern}`);
if (files.length === 0) {
    tl.error(`Could not find files with pattern [${filePattern}] in path [${sourcePath}]`);
    tl.exit(1);
}

for (var i = 0; i < files.length; i++) {
	var file = files[i];
    console.info(`Starting regex replacement in ${file}`);
	
	var contents = fs.readFileSync(file, 'utf8').toString();
    var reg = new RegExp(tokenRegex, "g");
            
    // loop through each match
    var match: RegExpExecArray;
    while((match = reg.exec(contents)) !== null) {
        // find the variable value in the environment
        var vName = match[1];
        
        var vValue = tl.getVariable(vName);
        if (typeof vValue === 'undefined') {
            tl.warning(`Token ${vName} does not have an environment value`);
        } else {
            contents = contents.replace(match[0], vValue);
            tl.debug(`Replaced token ${vName }`);
        }
    }
    console.info("Writing new values to file");
    
    // make the file writable
    sh.chmod(666, file);
    fs.writeFileSync(file, contents);
}

tl.debug("Leaving Replace Tokens step");