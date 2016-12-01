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
        'test/instrumented/*.js',
        'test/_testsuite.js'
    ];

    // paths to src files for instrumentation
    var srcPaths = [
        'Tasks/CoverageGate/*.js',
        'Tasks/ReplaceTokens/*.js',
        'Tasks/Tokenizer/*.js',
        'Tasks/VersionAssemblies/*.js'
    ];

    // invoke the tests
    gulp.src(srcPaths)
        .pipe(istanbul())
        .pipe(gulp.dest('./test/instrumented'))
        .on('finish', function() {
            gulp.src(testPaths)
                .pipe(mocha({ reporter: 'spec', ui: 'bdd', useColors: !tfBuild })
                    .on('error', reportErr))
                .pipe(istanbul.writeReports({
                    includeAllSources: true,
                    reporters: [ 'lcov', 'json', 'text', 'text-summary', 'html', 'cobertura' ]
                }))
                .on('error', reportErr)
                .on('end', cb);
        })
        .on('error', reportErr);
});