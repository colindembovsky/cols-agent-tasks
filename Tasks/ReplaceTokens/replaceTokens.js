var tl = require('vso-task-lib');
var fs = require('fs');
tl.debug("Starting Replace Tokens step");
// get the task vars
var filePath = tl.getPathInput("filePath", true, true);
var tokenRegex = tl.getInput("tokenRegex", true);
var files = tl.find(filePath);
if (files.length === 1) {
    var file = files[0];
    // read the file
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            tl.error("Could not read file " + filePath + ". Error is " + err.message);
            tl.exit(1);
        }
        var reg = new RegExp(tokenRegex, "g");
        console.info("Starting regex replacement in " + file);
        // loop through each match
        var match;
        while ((match = reg.exec(data)) !== null) {
            // find the variable value in the environment
            var varName = match[1];
            var varValue = tl.getVariable(varName);
            if (varValue === null) {
                tl.warning("... token " + varName + " does not have an environment value");
            }
            else {
                data = data.replace(match[0], varValue);
                tl.debug("... replaced token " + varName);
            }
        }
        console.info("Writing new values to file");
        fs.writeFileSync(file, data);
        tl.debug("Leaving Replace Tokens step");
    });
}
else {
    tl.error("Could not find file " + filePath);
    tl.exit(1);
}
//# sourceMappingURL=replaceTokens.js.map