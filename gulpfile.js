// import dependencies
var gulp = require('gulp');
var path = require('path');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

function reportErr(err){
    console.log('##vso[task.logissue type=error]' + err.message);
    console.log('##vso[task.complete result=failed]Failed');
}

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

var tfBuild = false;

gulp.task('instrument', function() {
    return gulp.src(srcPaths)
        .pipe(istanbul())
        .pipe(gulp.dest('./test/instrumented'))
        .pipe(istanbul.hookRequire());
});

gulp.task('test-cover', ['instrument'], function() {
    // invoke the tests
    gulp.src(testPaths)
        .pipe(mocha({ reporter: 'spec', ui: 'bdd', useColors: !tfBuild })
            .on('error', reportErr))
        .pipe(istanbul.writeReports({
            includeAllSources: true,
            reporters: [ 'html', 'cobertura' ]
        }))
        .on('error', reportErr);
});

gulp.task('test', ['instrument'], function() {
    gulp.src(testPaths)
        .pipe(mocha({ 
            reporter:'mocha-junit-reporter',
            reporterOptions: {
                mochaFile: "./test-results.xml"
            }
        })
            .on('error', reportErr));
});