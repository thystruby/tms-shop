const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const del = require('del');
  
function browsersync() {
  browserSync.init({
    server: { baseDir: 'app/' },
    notify: false,
    online: true
  })
}
  
function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'app/js/app.js',
    ])
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js/'))
  .pipe(browserSync.stream())
}
  
function styles() {
  return src('app/scss/style.scss')
  .pipe(sass())
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
  .pipe(dest('app/css/'))
  .pipe(browserSync.stream())
}
  
function buildcopy() {
  return src([
    'app/css/**/*.min.css',
    'app/js/**/*.min.js',
    'app/images/**/*',
    'app/**/*.html',
    'app/fonts/**/*'
    ], { base: 'app' })
  .pipe(dest('dist'))
}
  
function cleandist() {
  return del('dist/**/*', { force: true })
}
  
function startwatch() {
  watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
  watch('app/**/scss/**/*', styles);
  watch('app/**/*.html').on('change', browserSync.reload);
}
  
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.build = series(cleandist, styles, scripts, buildcopy);
exports.default = parallel(styles, scripts, browsersync, startwatch);
