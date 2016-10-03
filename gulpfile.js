// import dependencies
var gulp = require('gulp');
var path = require('path');
var mocha = require('gulp-mocha');
//require('babel-core/register');  // for mocha

gulp.task('test', function() {
    var testPath = path.resolve(__dirname, 'test', '_testsuite.js');
    var tfBuild = false;
    return gulp.src([testPath])
        .pipe(mocha({ reporter: 'spec', ui: 'bdd', useColors: !tfBuild }))
        .on('error', function (err) {
            console.log('##vso[task.logissue type=error]' + err.message);
            console.log('##vso[task.complete result=failed]Failed');
        });
});