"use strict";
const path = require('path');
const assert = require('assert');
const ttm = require('vsts-task-lib/mock-test');
const debug = false;
xdescribe('replaceTokens', function () {
    before(() => {
    });
    after(() => {
    });
    it('should succeed with default inputs', (done) => {
        // this.timeout(1000);
        let tp = path.join(__dirname, 'replaceTokens', 'test-normalInputs.js');
        let tr = new ttm.MockTestRunner(tp);
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
        let tr = new ttm.MockTestRunner(tp);
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
        let tr = new ttm.MockTestRunner(tp);
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
xdescribe('versionAssemblies', function () {
    before(() => {
    });
    after(() => {
    });
    it('should succeed with default inputs', (done) => {
        // this.timeout(1000);
        let tp = path.join(__dirname, 'versionAssemblies', 'test-defaults.js');
        let tr = new ttm.MockTestRunner(tp);
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
        let tr = new ttm.MockTestRunner(tp);
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
        let tr = new ttm.MockTestRunner(tp);
        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        assert.equal(tr.errorIssues[0], "No matches for regex [\\d+\\.\\d+\\.\\d+\\.\\d+] found in file working\\AssemblyInfo.cs");
        done();
    });
});
xdescribe('tokenizer JSON', function () {
    before(() => {
    });
    after(() => {
    });
    it('should succeed with default inputs', (done) => {
        // this.timeout(1000);
        let tp = path.join(__dirname, 'tokenizer', 'test-defaults.js');
        let tr = new ttm.MockTestRunner(tp);
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
        let tr = new ttm.MockTestRunner(tp);
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
        let tr = new ttm.MockTestRunner(tp);
        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });
    it('should fail if includes and excludes are both specified', (done) => {
        // this.timeout(1000);
        let tp = path.join(__dirname, 'tokenizer', 'test-failIfBothIncAndExcSpecified.js');
        let tr = new ttm.MockTestRunner(tp);
        let x = tr.run();
        if (debug) {
            console.log(tr.stdout);
        }
        assert(tr.failed, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        assert.equal(tr.errorIssues[0], "You cannot specify includes and excludes - please specify one or the other");
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
        let tr = new ttm.MockTestRunner(tp);
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
        let tr = new ttm.MockTestRunner(tp);
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
});
//# sourceMappingURL=_testsuite.js.map