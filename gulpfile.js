var gulp = require('gulp');
var stylus = require('gulp-stylus');
var del = require('del');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var order = require('gulp-order');
var flatten = require('gulp-flatten');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');


var SRC_DIR = './src/';
var DST_DIR = './dist/';
var PKG_DIR = './tmp/';

/**
 * deal stylus
 */
gulp.task('stylus_index', function() {
  return gulp.src('src/styles/index.styl')
    .pipe(changed(DST_DIR, {extension: '.css'}))
    .pipe(stylus())
    .pipe(cssmin())
    .pipe(gulp.dest(DST_DIR + '/styles'))
    .pipe(plumber())
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('stylus_links', function() {
  return gulp.src('src/styles/links.styl')
    .pipe(changed(DST_DIR, {extension: '.css'}))
    .pipe(stylus())
    .pipe(cssmin())
    .pipe(gulp.dest(DST_DIR + '/styles'))
    .pipe(plumber())
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('stylus', ['stylus_index', 'stylus_links']);

/**
 * deal script
 */
gulp.task('script_index', function() {
  return gulp.src([
      "src/scripts/jquery-2.1.4.min.js",
      "src/scripts/highlight.min.js",
      "src/scripts/unslider-min.js",
      "src/scripts/jsonp.js",
      "src/scripts/utils.js",
      //"src/scripts/plugins.js",
      "src/scripts/site.data.js",
      "src/scripts/index.append.data.js",
      "src/scripts/hot_news.js",
      "src/scripts/weather.js",
      "src/scripts/search_engine.js",
      'src/scripts/search_2.js',
      "src/scripts/index.js"
    ])
    .pipe(uglify())
    .pipe(concat("scripts/index.js"))
    .pipe(gulp.dest(DST_DIR))
    .pipe(plumber())
    .pipe(browserSync.reload({
      stream: true
    }))
});
gulp.task('script_links', function() {
  return gulp.src([
      "src/scripts/jquery-2.1.4.min.js",
      "src/scripts/highlight.min.js",
      "src/scripts/jsonp.js",
      "src/scripts/utils.js",
      "src/scripts/site.data.js",
      "src/scripts/link.append.data.js",
      "src/scripts/weather.js",
      "src/scripts/search_engine.js",
      'src/scripts/search_2.js',
    ])
    .pipe(uglify())
    .pipe(concat("scripts/links.js"))
    .pipe(gulp.dest(DST_DIR))
    .pipe(plumber())
    .pipe(browserSync.reload({
      stream: true
    }))
});
gulp.task('script', ['script_index', 'script_links']);

/**
 * deal html
 */

gulp.task('html', function() {
  var options = {
      removeComments: true,//清除HTML注释
      collapseWhitespace: true,//压缩HTML
      collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      minifyJS: true,//压缩页面JS
      minifyCSS: true//压缩页面CSS
  };
  return gulp.src('src/**/*.html')
    .pipe(htmlmin(options))
    .pipe(gulp.dest(DST_DIR))
    .pipe(plumber())
    .pipe(browserSync.reload({
      stream: true
    }))
});

/**
 * deal image
 */

gulp.task('imageCopy', function() {
  return gulp.src('src/images/**/*.*')
    .pipe(gulp.dest(DST_DIR + '/images'))
});

/**
 * clean dist
 */
gulp.task('clean', function() {
  return del(['dist', 'tmp']);
});

/**
 * watch change
 */
gulp.task('watch', ['browserSync', 'stylus'], function() {
  gulp.watch('src/**/*.styl', ['stylus']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/**/*.js', ['script']);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  })
});

gulp.task('default',function(cb) {
 runSequence('clean',['watch', 'html','stylus', 'script', 'imageCopy'])
});

gulp.task('build', function() {
  runSequence('html' ,'clean', 'stylus', 'imageCopy', 'script')
})
