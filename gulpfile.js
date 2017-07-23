const gulp = require('gulp');

gulp.task('default', () => {
    return gulp.src(['./src/views/*.pug']).pipe(gulp.dest('./dist/views'));
});