"use strict";
const path = require('path');
const assert = require('assert');
const ttm = require('vsts-task-lib/mock-test');
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
        console.log(tr.stdout);
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
        console.log(tr.stdout);
        console.log(tr.stderr);
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
//# sourceMappingURL=_testsuite.js.map