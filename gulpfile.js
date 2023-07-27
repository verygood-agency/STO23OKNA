const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const scss = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const rm = require('gulp-rm');
const gcmq = require('gulp-group-css-media-queries');
const order = require('gulp-order');
const sassGlob = require('gulp-sass-glob');
// const htmlreplace = require('gulp-html-replace');

const browserSync = require('browser-sync').create();


gulp.task('cleaner', function () {
  return gulp.src('dist/**/*', { read: false })
    .pipe(rm())
})

// Обработка HTML
gulp.task('html', function () {
  return gulp.src(['src/html/*.html'])
    .pipe(fileInclude({
      basePath: 'src/html/include/'
    }))
    .pipe(fileInclude({
      basePath: 'src/html/items/'
    }))
    .pipe(fileInclude({
      basePath: 'src/html/sections/'
    }))
    // .pipe(htmlreplace({
    //   'css': 'css/main.min.css'
    // }))
    .pipe(gulp.dest('dist'));
});


// Обработка IMG
gulp.task('img', function () {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

// Обработка FONTS
gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

// Обработка LIBS
gulp.task('libs', function () {
  return gulp.src('src/libs/**/*')
    .pipe(gulp.dest('dist/libs'));
});

// Обработка SCSS
gulp.task('scss', function () {
  return gulp.src('src/scss/main.scss')
    .pipe(sassGlob())
    .pipe(scss().on('error', scss.logError))
    .pipe(gcmq())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
});

// Обработка javascript
gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(order([
      'js/parts/*.js',
      'src/js/*.js'
    ]))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
});

// Отслеживание изменений
gulp.task('watch', function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch('src/**/*.html', gulp.series('html'));
  gulp.watch('src/scss/**/*.scss', gulp.series('scss'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
  gulp.watch('src/img/**/*', gulp.series('img'));
  gulp.watch('src/libs/**/*', gulp.series('libs'));
  gulp.watch('src/fonts/**/*', gulp.series('fonts'));

  gulp.watch('dist/**/*').on('change', browserSync.reload);
});

// Задача по умолчанию
gulp.task('default', gulp.series('cleaner', 'html', 'libs', 'fonts', 'img', 'scss', 'js', 'watch')
);
