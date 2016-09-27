import path = require('path');
import assert = require('assert');
import ttm = require('vsts-task-lib/mock-test');

describe('replaceTokens', function () {
    // before(() => {

    // });

    // after(() => {

    // });

    it('should succeed with default inputs', (done: MochaDone) => {
        // this.timeout(1000);

        let tp = path.join(__dirname, 'replaceTokens', 'test-normalInputs.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.stdout);
        if (tr.stderr) {
           done(tr.stderr);
           return;
        }
        // assert(tr.succeeded, 'should have succeeded');
        //assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        //assert.equal(tr.errorIssues.length, 0, "should have no errors");
        //assert(tr.stdout.indexOf('Hello Mock!') >= 0, "task module is called");

        done();
    });
});

