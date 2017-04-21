// import dependencies
var gulp = require('gulp');
var path = require('path');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var ts = require('gulp-typescript');

function reportErr(err) {
    //console.log('##vso[task.logissue type=error]' + err.message);
    //console.log('##vso[task.complete result=failed]Failed');
}

var tsProject = ts.createProject('tsconfig.json');

// path to test files
var paths = {
    tsFiles: [
        'test/**/*.ts',
        'Tasks/**/*.ts'
    ],
    testPaths: [
        'test/instrumented/*.js',
        'test/_testsuite.js'
    ],
    jsPaths: [
        'Tasks/CoverageGate/*.js',
        'Tasks/ReplaceTokens/*.js',
        'Tasks/Tokenizer/*.js',
        'Tasks/VersionAssemblies/*.js'
    ],

};

var tfBuild = false;

gulp.task('instrument', ['build'], function() {
    return gulp.src(paths.jsPaths)
        .pipe(istanbul())
        .pipe(gulp.dest('./test/instrumented'))
        .pipe(istanbul.hookRequire());
});

gulp.task('test-cover', ['instrument'], function() {
    // invoke the tests
    gulp.src(paths.testPaths)
        .pipe(mocha({ reporter: 'spec', ui: 'bdd', useColors: !tfBuild })
            .on('error', reportErr))
        .pipe(istanbul.writeReports({
            includeAllSources: true,
            reporters: [ 'html', 'cobertura' ]
        }))
        .on('error', reportErr);
});

gulp.task('test', ['build'], function() {
    gulp.src(paths.testPaths)
        .pipe(mocha({ 
            reporter:'mocha-junit-reporter',
            reporterOptions: {
                mochaFile: "./test-results.xml"
            }
        })
        .on('error', reportErr));
});

gulp.task('test-all', ['test', 'test-cover'], function() {});

gulp.task('build', function() {
    var compiled = gulp.src(paths.tsFiles, { base: "." })
        .pipe(tsProject());
    
    return compiled.js
        .pipe(gulp.dest('.'));
});