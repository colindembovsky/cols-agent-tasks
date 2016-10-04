"use strict";
const path = require('path');
const assert = require('assert');
const ttm = require('vsts-task-lib/mock-test');
const debug = false;
describe('replaceTokens', function () {
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
});
describe('versionAssemblies', function () {
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
        assert(tr.failed, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error");
        assert.equal(tr.errorIssues[0], "No matches for regex [\\d+\\.\\d+\\.\\d+\\.\\d+] found in file working\\AssemblyInfo.cs");
        done();
    });
});
//# sourceMappingURL=_testsuite.js.map