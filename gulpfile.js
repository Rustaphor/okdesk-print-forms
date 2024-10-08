const { watch, series, parallel, src, dest } = require('gulp');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const transform = require('gulp-transform');
const inlineCss = require('gulp-inline-css');
const fs = require('fs');
const replace = require('@stdlib/string-replace');
const webserver = require('gulp-webserver');

// Настройки директорий
var dir = {
  build: 'dist/',
  tempout: "output/",
  test: 'test/',
  src: {
    pugs: 'src-forms/*.pug',
    sass: 'src-forms/**/*.sass'
    }
}


// Задача `clean` очистка от всех временных файлов
function cleanFiles() {
  console.log("Clean directories");
  return src([dir.tempout, dir.build], {read: false, allowEmpty: true})
    .pipe(clean({force: true}));
}

// Задача конвертирование и минимизация SASS->CSS
function buildStyles() {
  return src(dir.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(dir.tempout));
}

// Задача конвертирование и минимизация SASS->CSS
function inlineStyles() {
  return src(dir.tempout + '**/*.html')
    .pipe(inlineCss({removeHtmlSelectors: true}).on('error', sass.logError))
    .pipe(dest(dir.tempout));
}

// Задача минимизация HTML кода
function htmlMinify() {
  return src(dir.tempout + '**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({ extname: '.html.txt' }))
    .pipe(dest(dir.build));
}

// Задача конвертирование файлов PUG->HTML
function pug2htmlConvert() {

  return src(dir.src.pugs)
    .pipe(pug({
      data: {name: 'Modest'}
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(dir.tempout));
}

// Подзадача тестирования. Создание визуализации по шаблону.
function testFormCreate(){

  var template = fs.readFileSync(dir.test + 'printed_form_okdesk_template.html','utf8');

  return src(dir.tempout + '**/*.html')
    .pipe(transform('utf8',(content, file) => {
        return replace(template, '%CUSTOM_FORM_PLACER%', content);
    }))
    .pipe(dest(dir.tempout + dir.test));
}

// Подзадача тестирования. Копирование сопутствующих файлов теста.
function testOthersCopy(){
  return src(dir.test + '*.css').pipe(dest(dir.tempout + dir.test));
}

// Наблюдать за исходными файлами и компиллировать их на лету при изменении Ctrl+C завершить работу
// Перед первым запуском выполнить команду build
function watching () {
  console.log("Watching files PUGs, SASS'...");
  watch(dir.src.pugs, { queue: false }, series(pug2htmlConvert, testFormCreate));
  watch(dir.src.sass, { queue: false }, buildStyles);
}

// Запуск локального веб-сервера для проверки отображения форм Ctrl+C завершить работу
// Перед первым запуском выполнить команду test
function webServer() {
  return src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: dir.tempout + dir.test,
      port: 8080
    }))
}


exports.clean = cleanFiles;
exports.build = series(cleanFiles, buildStyles, pug2htmlConvert, inlineStyles, htmlMinify);
exports.test = series(buildStyles, pug2htmlConvert, testOthersCopy, testFormCreate);
exports.webserver = webServer;
exports.watch = watching;

// Watching files (live compiling)
exports.default = parallel(webServer, watching);
