import path = require('path');
import assert = require('assert');
import ttm = require('azure-pipelines-task-lib/mock-test');

const debug = process.env["NODE_ENV"] === "debugtest";
if (debug) {
    console.log("------ RUNNING IN DEBUG ------------");
}

describe('replaceTokens', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with default inputs', (done) => {
        this.timeout(10000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-normalInputs.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with ascii inputs', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-ascii.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with empty path', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-emptyPath.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with @ tokens', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-atTokens.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with dotted tokens', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-dotTokens.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should report warning when warnings without warningsAsErrors', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-warnings-as-error-off.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 1, "should have 1 warning");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should report error when warnings with warningsAsErrors', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-warnings-as-errors-on.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 2, "should have 2 errors");
        assert.equal(tr.errorIssues[0], "Token [CoolKey] does not have an environment value");

        done();
    });

    it('should with arrays', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-arrays.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });
});

describe('versionAssemblies', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with default 4 part inputs', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-defaults4.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with default 3 part inputs', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-defaults3.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with custom settings', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-custom.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with complex Android-like setup', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-complex.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should fail if there is no match', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-failIfNotFound.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        if (!tr.errorIssues[0].startsWith("No matches for regex [\\d+\\.\\d+\\.\\d+\\.\\d+] found in file") ||
            !tr.errorIssues[0].endsWith("AssemblyInfo.cs")) {
            done("Incorrect error message");
        }        

        done();
    });

    it('should succeed for multi-line replacements', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-multiline.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    }); 
});

describe('tokenizer JSON', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with default inputs', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-defaults.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with trailing slash in source path', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-trailingSlash.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with excludes', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-exclude.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should replace all if includes and excludes are both empty', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-all.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should fail if includes and excludes are both specified', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-failIfBothIncAndExcSpecified.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        assert.equal(tr.errorIssues[0], "You cannot specify includes and excludes - please specify one or the other");

        done();
    });

    it('should succeed for primitive array objects', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-arrays-primitive.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");

        done();
    });

    it('should succeed for complex array objects', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-arrays-complex.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");

        done();
    });

    it('should warn when nullBehavior is warning', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-writesWarningForNullWhenNullBehaviorIsWarn.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.warningIssues.length, 1, "should have warnings");
        assert.equal(tr.warningIssues[0], "Property Tricky.Tricky is null");

        done();
    });

    it('should fail if nullBehavior is set to null', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-failsWhenNullBehaviorIsError.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 2, "should have 2 errors");
        assert.equal(tr.errorIssues[0], "Property Tricky.Tricky is null");
        assert.equal(tr.errorIssues[1], "Tokenization failed - please check previous logs.");
        
        done();
    });
});

describe('coverageGate', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with lt and 0 delta', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-lessThan0-succeeds.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with lt and negative delta', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-negdelta-succeeds.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with lt and positive delta', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-posdelta-succeeds.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should fail with le and 0 delta', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-lessEqual0-fails.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Coverage delta is below the threshold of 0");

        done();
    });

    it('should fail with no coverage data', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-nodata-fails.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "No coverage data for build. Cannot determine trend.");

        done();
    });

    it('should fail with no deltas', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-nodelta-fails.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "There are no coverage deltas. Make sure you have at least 2 builds.");

        done();
    });

    it('should fail with no auth', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-noauth-fails.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Could not find token for autheniticating. Please enable OAuth token in Build/Release Options or supply username/password.");

        done();
    });

    it('should succeed with username', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'coverageGate', 'test-username-succeeds.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have 0 errors");

        done();
    });
});

describe('tagBuild', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with single tag', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-singleTag-succeeds.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with multiple tags', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-multiTag-succeeds.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with type=release in release', async (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-tagRelease-succeeds.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succeed with type=build in release', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-tagBuildFromRelease-succeeds.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should fail with no auth', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-noauth-fails.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Could not find token for autheniticating. Please enable OAuth token in Build/Release Options.");

        done();
    });

    it('should fail with type=build and no buildId', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-build-noBuildId-fails.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "No build ID found - perhaps Type should be 'Release' not 'Build'?");

        done();
    });

    it('should fail with type=release and no releaseId', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-release-noReleaseId-fails.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "No release ID found - perhaps Type should be 'Build' not 'Release'?");

        done();
    });

    it('should handle failed call to releaseApi', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-tagReleaseHandlesFailedCall.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Something went wrong with release api call");

        done();
    });

    it('should handle failed call to buildApi', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tagBuild', 'test-tagBuildHandlesFailedCall.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Something went wrong with build api call");

        done();
    });
});

describe('routeTraffic', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with normal inputs', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'routeTraffic', 'test-success-forNormalInputs.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should fail with auth fail', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'routeTraffic', 'test-handles-authFailure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Could not get Auth Token: [401] access denied");

        done();
    });

    it('should fail when traffic call fails', (done) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'routeTraffic', 'test-handles-callFailure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }

        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have failed");
        assert.equal(tr.errorIssues[0], "Could not configure app settings experiment: [500] something broke");

        done();
    });
});