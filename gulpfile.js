var gulp          = require('gulp');
var inject        = require('gulp-inject');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var cleanCSS      = require('gulp-clean-css');
var runSequence   = require('run-sequence');
var del           = require('del');
var args          = require('yargs').argv;
var obfuscate     = require('gulp-obfuscate');

var developmentTasks  = ['copy-html', 'copy-js', 'copy-lib', 'copy-css'];
var productionTasks   = ['copy-html', 'merge-js', 'merge-lib', 'merge-css'];

gulp.task('build', function() {
  runSequence('clean', eval((args.env || "development") + "Tasks"));
});

gulp.task('clean', function(callback) {
  del(['./build/**/*']).then(paths => {
    // console.log('deleted file(s) and forlder(s):');
    // if(0 === paths.length) {
    //   console.log('NONE!');
    // }
    // else {
    //   console.log(paths.join('\n'));
    // }

    callback();
  });
});

gulp.task('copy-html', function () {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-js', function () {
  gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./build/js'));
});

gulp.task('copy-lib', function () {
  gulp.src('./src/lib/**/*.js')
    .pipe(gulp.dest('./build/lib'));
});

gulp.task('copy-css', function () {
  gulp.src('./src/css/**/*.css')
    .pipe(gulp.dest('./build/css'));
});

gulp.task('merge-js', function () {
  gulp.src(['./src/js/**/*.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(obfuscate())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('merge-lib', function () {
  gulp.src(['./src/lib/**/*.js'])
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .pipe(obfuscate())
    .pipe(gulp.dest('./build/lib'));
});

gulp.task('merge-css', function () {
  gulp.src(['./src/css/**/*.css'])
    .pipe(concat('style.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('inject-files-to-html', function () {
  gulp.src('./build/index.html')
  .pipe(inject(gulp.src('./build/css/**/*.css', {read: false}), {relative: true, starttag: '<!-- inject:app:{{ext}} -->'}))
  .pipe(inject(gulp.src(['./build/*.js', './build/js/**/*.js'], {read: false}), {relative: true, starttag: '<!-- inject:app:{{ext}} -->'}))
  .pipe(inject(gulp.src('./build/lib/**/*.js', {read: false}), {relative: true, starttag: '<!-- inject:lib:{{ext}} -->'}))
  .pipe(gulp.dest('./build'));
});
