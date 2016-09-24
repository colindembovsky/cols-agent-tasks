var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
describe('replaceTokens', function () {
    // before(() => {
    // });
    // after(() => {
    // });
    it('should succeed with default inputs', (done) => {
        // this.timeout(1000);
        let tr = new ttm.MockTestRunner("");
        tr.run();
        //let tp = path.join(__dirname, 'replaceTokens', 'test-normalInputs.js');
        //let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        // tr.run();
        // console.log(tr.succeeded);
        // console.log(tr.stdout);
        // console.log(tr.stderr);
        //assert(tr.succeeded, 'should have succeeded');
        //assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        //assert.equal(tr.errorIssues.length, 0, "should have no errors");
        //assert(tr.stdout.indexOf('Hello Mock!') >= 0, "task module is called");
        done();
    });
});
//# sourceMappingURL=_testsuite.js.map