const { series, src, dest } = require('gulp');
const rename = require('gulp-rename');
const pug = require('gulp-pug');

// Задача `clean` очистка от всех временных файлов
function clean(cb) {
  // TODO: очистка директории
  console.log("Clean - Еще не реализовано");
  cb();
}

// Задание `build` компилляция проекта
function build() {
  // TODO: вставить все подзадачи

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
exports.build = series(clean, build);
exports.default = defaultTask;