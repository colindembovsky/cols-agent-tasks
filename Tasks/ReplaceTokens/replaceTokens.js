var tl = require('vso-task-lib');
var sh = require('shelljs');
var fs = require('fs');
tl.debug("Starting Replace Tokens task");
// get the task vars
var sourcePath = tl.getPathInput("sourcePath", true, true);
var filePattern = tl.getInput("filePattern", true);
var tokenRegex = tl.getInput("tokenRegex", true);
var secretTokenInput = tl.getInput("secretTokens", false);
// store the tokens and values if there is any secret token input 
var secretTokens = {};
if (typeof secretTokenInput !== "undefined") {
    var inputArray = secretTokenInput.split(";");
    for (var _i = 0; _i < inputArray.length; _i++) {
        var token = inputArray[_i];
        if (token.indexOf(":") > -1) {
            var valArray = token.split(":");
            if (valArray.length == 2) {
                var key = valArray[0].trim().toLowerCase();
                secretTokens[key] = valArray[1].trim();
                console.log("Secret token input found [" + key + "]");
            }
        }
    }
    tl.debug("secretTokens: found [" + Object.keys(secretTokens).length + "] tokens");
}
tl.debug("sourcePath: [" + sourcePath + "]");
tl.debug("filePattern: [" + filePattern + "]");
tl.debug("tokenRegex: [" + tokenRegex + "]");
if (filePattern === undefined || filePattern.length === 0) {
    filePattern = "*.*";
}
tl.debug("Using [" + filePattern + "] as filePattern");
// create a glob removing any spurious quotes
var globPattern = (sourcePath + "\\" + filePattern).replace("\"", "");
var files = tl.glob(globPattern);
if (files.length === 0) {
    tl.error("Could not find files with glob [" + globPattern + "]");
    tl.exit(1);
}
for (var i = 0; i < files.length; i++) {
    var file = files[i];
    console.info("Starting regex replacement in [" + file + "]");
    var contents = fs.readFileSync(file, 'utf8').toString();
    var reg = new RegExp(tokenRegex, "g");
    // loop through each match
    var match;
    while ((match = reg.exec(contents)) !== null) {
        var vName = match[1];
        if (typeof secretTokens[vName.toLowerCase()] !== "undefined") {
            // try find the variable in secret tokens input first
            contents = contents.replace(match[0], secretTokens[vName.toLowerCase()]);
            tl.debug("Replaced token [" + vName + "] with a secret value");
        }
        else {
            // find the variable value in the environment
            var vValue = tl.getVariable(vName);
            if (typeof vValue === 'undefined') {
                tl.warning("Token [" + vName + "] does not have an environment value");
            }
            else {
                contents = contents.replace(match[0], vValue);
                tl.debug("Replaced token [" + vName + "]");
            }
        }
    }
    console.info("Writing new values to file");
    // make the file writable
    sh.chmod(666, file);
    fs.writeFileSync(file, contents);
}
tl.debug("Leaving Replace Tokens task");
//# sourceMappingURL=replaceTokens.js.map