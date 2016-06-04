var gulp = require('gulp');

gulp.task('default', function() {
  // place code for this task here
});

gulp.task('src', function() {
	gulp.src('./src/**/*.js')
	.pipe(gulp.dest('build'));
});
