const { src, dest, series, watch } = require('gulp'),
  minifyCSS = require('gulp-csso'),
  minifyJS = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer'),
  size = require('gulp-size'),
  rev = require('gulp-rev'),
  del = require('del'),
  gutil = require('gulp-util'),
    browserSync = require('browser-sync').create();

const SRC = {
  style: 'assets/css',
  js: 'assets/js',
  dist: 'dist',
  template: 'index.php'
};

// - - - - - - - - - - - - - - - - - - - -
// ToDo Build functions for project =>
const build_style = async function () {
  await del([`${SRC.dist}/all*.css`]);
  await src([
    `${SRC.style}/index.scss`,
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      sass().on('error', function (e) {
        gutil.log(e);
      })
    )
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    // .pipe(minifyCSS())
    .pipe(rename('all.css'))
    .pipe(size())
    // .pipe(rev())
    .pipe(dest(SRC.dist));
};

exports.css = series(build_style);

// - - - - - - - - - - - - - - - - - - - - -
// ToDo Watch functions for project =>
const watch_style = () => {
  watch(`${SRC.style}/**/*`, series(build_style))
};

exports.watch_style = series(watch_style);

// - - - - - - - - - - - - - - - - - - - - -
// ToDo BrowserSync functions =>
const serve = () => {
    console.warn('Serve starts!');
    browserSync.init({
        files: [
            {
                options: {
                    ignored: ".*",
                },
            },
        ],
        port: 8181,
        proxy: 'file:///E:/Web/creative.loc/',
        reloadOnRestart: true,
    });
    watch([SRC.template]).on("change", browserSync.reload);
    watch(`${SRC.style}/**/*`, series(build_style));
};

exports.serve = series( serve );

// - - - - - - - - - - - - - - - - - - - - -
// ToDo Default function runner build =>
exports.default = series( build_style);
