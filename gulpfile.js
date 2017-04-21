// import dependencies
var gulp = require('gulp');
var path = require('path');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');

function reportErr(err) {
    console.log('##vso[task.logissue type=error]' + err.message);
    console.log('##vso[task.complete result=failed]Failed');
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
    ]
};

var tfBuild = false;

gulp.task('test', ['build'], function() {
    return gulp.src(paths.testPaths)
        .pipe(mocha({ 
            reporter:'mocha-junit-reporter',
            reporterOptions: {
                mochaFile: "./test-results.xml"
            }
        })
        .on('error', reportErr));
});

gulp.task('build', function() {
    var compiled = gulp.src(paths.tsFiles, { base: "." })
        .pipe(tsProject());
    
    return compiled.js
        .pipe(gulp.dest('.'));
});