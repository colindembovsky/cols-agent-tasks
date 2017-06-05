import path = require('path');
import assert = require('assert');
import ttm = require('vsts-task-lib/mock-test');

const debug = process.env["NODE_ENV"] === "debugtest";
if (debug) {
    console.log("------ RUNNING IN DEBUG ------------");
}

describe('replaceTokens', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with default inputs', (done: MochaDone) => {
        // this.timeout(1000);

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

    it('should succeed with ascii inputs', (done: MochaDone) => {
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

    it('should succeed with empty path', (done: MochaDone) => {
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

    it('should succeed with @ tokens', (done: MochaDone) => {
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

    it('should succeed with dotted tokens', (done: MochaDone) => {
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
});

describe('versionAssemblies', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with default 4 part inputs', (done: MochaDone) => {
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

    it('should succeed with default 3 part inputs', (done: MochaDone) => {
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

    it('should succeed with custom settings', (done: MochaDone) => {
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

    it('should succeed with complex Android-like setup', (done: MochaDone) => {
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

    it('should fail if there is no match', (done: MochaDone) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'versionAssemblies', 'test-failIfNotFound.js');
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
        if (!tr.errorIssues[0].startsWith("No matches for regex [\\d+\\.\\d+\\.\\d+\\.\\d+] found in file") ||
            !tr.errorIssues[0].endsWith("working\\AssemblyInfo.cs")) {
            done("Incorrect error message");
        }        

        done();
    });

    it('should succeed for multi-line replacements', (done: MochaDone) => {
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

    it('should succeed with default inputs', (done: MochaDone) => {
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

    it('should succeed with trailing slash in source path', (done: MochaDone) => {
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

    it('should succeed with excludes', (done: MochaDone) => {
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

    it('should replace all if includes and excludes are both empty', (done: MochaDone) => {
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

    it('should fail if includes and excludes are both specified', (done: MochaDone) => {
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

    it('should succeed for array objects', (done: MochaDone) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'tokenizer', 'test-array.js');
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
});

describe('coverageGate', function () {
    before(() => {
    });

    after(() => {
    });

    it('should succeed with lt and 0 delta', (done: MochaDone) => {
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

    it('should succeed with lt and negative delta', (done: MochaDone) => {
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

    it('should succeed with lt and positive delta', (done: MochaDone) => {
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

    it('should fail with le and 0 delta', (done: MochaDone) => {
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

    it('should fail with no coverage data', (done: MochaDone) => {
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

    it('should fail with no deltas', (done: MochaDone) => {
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

    it('should fail with no auth', (done: MochaDone) => {
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

    it('should succeed with username', (done: MochaDone) => {
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

    it('should succeed with single tag', (done: MochaDone) => {
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

    it('should succeed with multiple tags', (done: MochaDone) => {
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

    it('should succeed with type=release in release', async (done: MochaDone) => {
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

    it('should succeed with type=build in release', (done: MochaDone) => {
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

    it('should fail with no auth', (done: MochaDone) => {
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

    it('should fail with type=build and no buildId', (done: MochaDone) => {
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

    it('should fail with type=release and no releaseId', (done: MochaDone) => {
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

    it('should handle failed call to releaseApi', (done: MochaDone) => {
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

    it('should handle failed call to buildApi', (done: MochaDone) => {
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

    it('should succeed with normal inputs', (done: MochaDone) => {
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

    it('should fail with auth fail', (done: MochaDone) => {
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

    it('should fail when traffic call fails', (done: MochaDone) => {
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