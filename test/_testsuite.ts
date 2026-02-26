import path = require('path');
import assert = require('assert');
import ttm = require('azure-pipelines-task-lib/mock-test');

const debug = process.env["NODE_ENV"] === "debugtest";
if (debug) {
    console.log("------ RUNNING IN DEBUG ------------");
}

describe('replaceTokens', function () {
    it('should succeed with default inputs', async () => {
        // this.timeout(10000);
    
        let tp = path.join(__dirname, 'replaceTokens', 'test-normalInputs.js');
        let tj = path.join(__dirname, "../Tasks/ReplaceTokens/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);
    
        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
            throw new Error(tr.stderr);
        }
    
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with ascii inputs', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-ascii.js');
        let tj = path.join(__dirname, "../Tasks/ReplaceTokens/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with empty path', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-emptyPath.js');
        let tj = path.join(__dirname, "../Tasks/ReplaceTokens/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with @ tokens', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-atTokens.js');
        let tj = path.join(__dirname, "../Tasks/ReplaceTokens/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with dotted tokens', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-dotTokens.js');
        let tj = path.join(__dirname, "../Tasks/ReplaceTokens/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should report warning when warnings without warningsAsErrors', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-warnings-as-error-off.js');
        let tj = path.join(__dirname, "../Tasks/ReplaceTokens/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 1, "should have 1 warning");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should report error when warnings with warningsAsErrors', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-warnings-as-errors-on.js');
        let tj = path.join(__dirname, "../Tasks/ReplaceTokens/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 2, "should have 2 errors");
        assert.equal(tr.errorIssues[0], "Token [CoolKey] does not have an environment value");
    });

    it('should with arrays', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-arrays.js');
        let tj = path.join(__dirname, "../Tasks/ReplaceTokens/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });
});

describe('versionAssemblies', function () {
    it('should succeed with default 4 part inputs', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-defaults4.js');
        let tj = path.join(__dirname, "../Tasks/VersionAssemblies/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with default 3 part inputs', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-defaults3.js');
        let tj = path.join(__dirname, "../Tasks/VersionAssemblies/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with custom settings', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-custom.js');
        let tj = path.join(__dirname, "../Tasks/VersionAssemblies/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with complex Android-like setup', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-complex.js');
        let tj = path.join(__dirname, "../Tasks/VersionAssemblies/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should fail if there is no match', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-failIfNotFound.js');
        let tj = path.join(__dirname, "../Tasks/VersionAssemblies/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        if (!tr.errorIssues[0].startsWith("No matches for regex [\\d+\\.\\d+\\.\\d+\\.\\d+] found in file") ||
            !tr.errorIssues[0].endsWith("AssemblyInfo.cs")) {
            throw new Error("Incorrect error message");
        }        
    });

    it('should succeed for multi-line replacements', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-multiline.js');
        let tj = path.join(__dirname, "../Tasks/VersionAssemblies/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    }); 
});

describe('tokenizer JSON', function () {
    it('should succeed with default inputs', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-defaults.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with trailing slash in source path', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-trailingSlash.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with excludes', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-exclude.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should replace all if includes and excludes are both empty', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-all.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should fail if includes and excludes are both specified', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-failIfBothIncAndExcSpecified.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        assert.equal(tr.errorIssues[0], "You cannot specify includes and excludes - please specify one or the other");
    });

    it('should succeed for primitive array objects', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-arrays-primitive.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");
    });

    it('should succeed for complex array objects', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-arrays-complex.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");
    });

    it('should warn when nullBehavior is warning', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-writesWarningForNullWhenNullBehaviorIsWarn.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.warningIssues.length, 1, "should have warnings");
        assert.equal(tr.warningIssues[0], "Property Tricky.Tricky is null");
    });

    it('should fail if nullBehavior is set to null', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-failsWhenNullBehaviorIsError.js');
        let tj = path.join(__dirname, "../Tasks/Tokenizer/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 2, "should have 2 errors");
        assert.equal(tr.errorIssues[0], "Property Tricky.Tricky is null");
        assert.equal(tr.errorIssues[1], "Tokenization failed - please check previous logs.");
    });
});

describe('coverageGate', function () {
    it('should succeed with lt and 0 delta', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-lessThan0-succeeds.js');
        let tj = path.join(__dirname, "../Tasks/CoverageGate/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with lt and negative delta', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-negdelta-succeeds.js');
        let tj = path.join(__dirname, "../Tasks/CoverageGate/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with lt and positive delta', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-posdelta-succeeds.js');
        let tj = path.join(__dirname, "../Tasks/CoverageGate/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should fail with le and 0 delta', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-lessEqual0-fails.js');
        let tj = path.join(__dirname, "../Tasks/CoverageGate/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Coverage delta is below the threshold of 0");
    });

    it('should fail with no coverage data', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-nodata-fails.js');
        let tj = path.join(__dirname, "../Tasks/CoverageGate/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "No coverage data for build. Cannot determine trend.");
    });

    it('should fail with no deltas', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-nodelta-fails.js');
        let tj = path.join(__dirname, "../Tasks/CoverageGate/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "There are no coverage deltas. Make sure you have at least 2 builds.");
    });

    it('should fail with no auth', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-noauth-fails.js');
        let tj = path.join(__dirname, "../Tasks/CoverageGate/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Could not find token for autheniticating. Please enable OAuth token in Build/Release Options or supply username/password.");
    });

    it('should succeed with username', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-username-succeeds.js');
        let tj = path.join(__dirname, "../Tasks/CoverageGate/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");
    });
});

describe('tagBuild', function () {
    it('should succeed with single tag', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-singleTag-succeeds.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with multiple tags', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-multiTag-succeeds.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with type=release in release', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-tagRelease-succeeds.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should succeed with type=build in release', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-tagBuildFromRelease-succeeds.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should fail with no auth', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-noauth-fails.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Could not find token for autheniticating. For classic pipelines, please enable OAuth token in Build/Release Options. For YALM pipelines, set 'SYSTEM.ACCESSTOKEN' in the environment.");
    });

    it('should fail with type=build and no buildId', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-build-noBuildId-fails.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "No build ID found - perhaps Type should be 'Release' not 'Build'?");
    });

    it('should fail with type=release and no releaseId', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-release-noReleaseId-fails.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "No release ID found - perhaps Type should be 'Build' not 'Release'?");
    });

    it('should handle failed call to releaseApi', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-tagReleaseHandlesFailedCall.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Something went wrong with release api call");
    });

    it('should handle failed call to buildApi', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-tagBuildHandlesFailedCall.js');
        let tj = path.join(__dirname, "../Tasks/TagBuild/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Something went wrong with build api call");
    });
});

describe('routeTraffic', function () {
    it('should succeed with normal inputs', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'routeTraffic', 'test-success-forNormalInputs.js');
        let tj = path.join(__dirname, "../Tasks/RouteTraffic/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
    });

    it('should fail with auth fail', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'routeTraffic', 'test-handles-authFailure.js');
        let tj = path.join(__dirname, "../Tasks/RouteTraffic/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Could not get Auth Token: [401] access denied");
    });

    it('should fail when traffic call fails', async () => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'routeTraffic', 'test-handles-callFailure.js');
        let tj = path.join(__dirname, "../Tasks/RouteTraffic/task.json");
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp, tj);

        await tr.runAsync();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           throw new Error(tr.stderr);
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Could not configure app settings experiment: [500] something broke");
    });
});
