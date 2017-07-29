const gulp = require('gulp');
const sass = require('gulp-sass');

const BUILD_DIR = './dist';

gulp.task('copy-views', () => {
    return gulp.src(['./src/views/**/*.pug']).pipe(gulp.dest(`${BUILD_DIR}/views`));
});

gulp.task('sass', () => {
    return gulp.src('./src/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${(process.env.NODE_ENV === 'production') ? BUILD_DIR : './src'}/styles`));
});

gulp.task('watch', () => {
    gulp.watch('./src/styles/*.scss', ['sass']);
});

gulp.task('default', ['copy-views', 'sass']);
