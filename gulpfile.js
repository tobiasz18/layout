let gulp = require('gulp');
let browserSync = require('browser-sync');
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
let imagemin = require('gulp-imagemin');
let changed = require('gulp-changed');
let htmlReplace = require('gulp-html-replace');
let htmlMin = require('gulp-htmlmin');
let del = require('del');
let sequence = require('run-sequence')


gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

gulp.task('minify-css', function() { //dist
  return gulp.src('./src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('img', function() { //dist
    return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}')
        .pipe(changed('dist/img'))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('html', function() { //dist
    return gulp.src('src/*.html')
        .pipe(htmlReplace({
            'minify-css': 'css/style.css'
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist/'))
})

gulp.task('serve', ['sass'], function() {
    browserSync({
        server: 'src'
    });

    gulp.watch('src/*.html', ['reload']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
});

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('build', function() { //production
    sequence('clean', ['html', 'minify-css', 'img']);
});

gulp.task('default', ['serve']);
