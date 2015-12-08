var tl = require('vso-task-lib/vsotask');
var sh = require('shelljs');
tl.debug("Starting Replace Tokens step");
// get the task vars
var filePath = tl.getPathInput("filePath", true, true);
var tokenRegex = tl.getInput("tokenRegex", true);
tl.debug("filePath :" + filePath);
tl.debug("tokenRegex : " + tokenRegex);
var file = tl.find(filePath);
if (file) {
    var reg = new RegExp(tokenRegex, "g");
    sh.grep(reg, file);
}
else {
    tl.error("Could not find file " + filePath);
}
tl.debug("Leaving Replace Tokens step");
//# sourceMappingURL=replaceTokens.js.map