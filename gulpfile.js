// import dependencies
var gulp = require('gulp');
var path = require('path');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
//require('babel-core/register');  // for mocha

function reportErr(err){
    console.log('##vso[task.logissue type=error]' + err.message);
    console.log('##vso[task.complete result=failed]Failed');
}

gulp.task('test', function(cb) {
    var tfBuild = false;

    // path to test files
    var testPaths = [
        path.resolve(__dirname, 'test', '_testsuite.js')
    ];

    // paths to src files for instrumentation
    var srcPaths = [
        path.resolve(__dirname, 'Tasks', 'CoverageGate', '*.js'),
        path.resolve(__dirname, 'Tasks', 'ReplaceTokens', '*.js'),
        path.resolve(__dirname, 'Tasks', 'Tokenizer', '*.js'),
        path.resolve(__dirname, 'Tasks', 'VersionAssemblies', '*.js'),
    ];

    // invoke the tests
    gulp.src(srcPaths)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(testPaths)
                .pipe(mocha({ reporter: 'spec', ui: 'bdd', useColors: !tfBuild })
                    .on('error', reportErr))
                .pipe(istanbul.writeReports())
                .on('error', reportErr)
                .on('end', cb);
        })
        .on('error', reportErr);
});