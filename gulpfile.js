var gulp = require('gulp');

var inject = require('gulp-inject');

var concat = require('gulp-concat');

var uglify = require('gulp-uglify');

var cleanCSS = require('gulp-clean-css');

var runSequence = require('run-sequence');

var del = require('del');

gulp.task('index', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./src/js/**/*.js', './src/lib/**/*.js', './src/**/*.css'], {read: false});
 
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./src'));
});

gulp.task('clean', function() {
  del(['./build/**/*']).then(paths => {
    // console.log('deleted file(s) and forlder(s):');
    // if(0 === paths.length) {
    //   console.log('NONE!');
    // }
    // else {
    //   console.log(paths.join('\n'));      
    // }
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

var develeopTasks = ['clean', 'copy-html', 'copy-js', 'copy-lib', 'copy-css'];

gulp.task('build', function() {
  runSequence(develeopTasks)
});

gulp.task('merge-js', function () {
  gulp.src(['./src/js/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('merge-lib', function () {
  gulp.src(['./src/lib/**/*.js'])
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('merge-css', function () {
  gulp.src(['./src/css/**/*.css'])
    .pipe(concat('style.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('inject-files-to-html', function () {
  var target = gulp.src('./build/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./build/**/*.js', './build/**/*.css'], {read: false});
 
  return target.pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./build'));
});
 
