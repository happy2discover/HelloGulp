var gulp          = require('gulp');
var inject        = require('gulp-inject');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var cleanCSS      = require('gulp-clean-css');
var runSequence   = require('run-sequence');
var del           = require('del');
var args          = require('yargs').argv;
var obfuscate     = require('gulp-obfuscate');
var watch         = require('gulp-watch');

var developmentTasks  = ['copy-src-to-build', 'watch-src-folder'];
var productionTasks   = ['copy-html', 'merge-js', 'merge-lib', 'merge-css'];

gulp.task('default', ['inject-files-to-html']);

gulp.task('inject-files-to-html', function () {
  gulp.src('./src/index.html')
  .pipe(inject(gulp.src('./src/css/**/*.css', {read: false}), {relative: true, starttag: '<!-- inject:app:{{ext}} -->'}))
  .pipe(inject(gulp.src(['./src/*.js', './src/js/**/*.js'], {read: false}), {relative: true, starttag: '<!-- inject:app:{{ext}} -->'}))
  .pipe(inject(gulp.src('./src/lib/**/*.js', {read: false}), {relative: true, starttag: '<!-- inject:lib:{{ext}} -->'}))
  .pipe(gulp.dest('./src'));
});

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

gulp.task('copy-src-to-build', function() {
	gulp.src('./src/**/*')
		.pipe(gulp.dest('./build'));
});

gulp.task('watch-src-folder', function() {
	gulp.src(['./src/*','./src/**/*'], {base: './src'})
		.pipe(watch('src/**/*', {base: 'src'}))
		.pipe(gulp.dest('./build'));
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
