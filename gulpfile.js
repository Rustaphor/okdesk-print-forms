const { series, src, dest } = require('gulp');
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');


// Задача `clean` очистка от всех временных файлов
function clean(cb) {
  // TODO: очистка директории
  console.log("Clean - Еще не реализовано");
  cb();
}

// Задача конвертирование и минимизация SASS->CSS
function buildStyles() {
  return src('src-forms/**/*.sass')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('output'));
};

// Задача минимизация HTML кода
function htmlMinify() {
  return src('output/**/*.html.txt')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
};

// Задача конвертирование файлов PUG->HTML
function pug2htmlConvert() {

  return src('src-forms/*.pug')
    .pipe(pug({
      data: {name: 'Modest'}
    }))
    .pipe(rename({ extname: '.html.txt' }))
    .pipe(dest('output'));
}


function defaultTask(cb) {
  // TODO: Поместить заданич по-умолчанию
  console.log("defaultTask - Еще не реализовано");
  cb();
}

exports.clean = clean;
exports.buildStyles = buildStyles;
exports.build = series(clean, buildStyles, pug2htmlConvert, htmlMinify);
exports.default = defaultTask;

exports.watch = function () {
  gulp.watch('src-forms/**/*.sass', ['sass']);
};