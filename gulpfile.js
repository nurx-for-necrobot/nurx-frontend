var jsfiles = [
    './src/js/i18n.js',
    './src/js/encountermarker.js',
    './src/js/kobindings.js',
    './src/js/pokedata.js',
    './src/js/app.js',
    './src/js/sessionloader.js',
    './src/js/panels/log.js',
    './src/js/panels/navigation.js',
    './src/js/panels/pokemon.js',
    './src/js/panels/inventory.js'
];

var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    gp_sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var path = require('path');
var cleanCSS = require('gulp-clean-css');

gulp.task('js', function(){
    return gulp.src(jsfiles)
        .pipe(gp_sourcemaps.init())
        .pipe(gp_concat('nurx-concat.js'))
        .pipe(gulp.dest('tmp'))
        .pipe(gp_rename('nurx.min.js'))
        .pipe(gp_uglify())
        .pipe(gp_sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', ['less'], function() {
  return gulp.src('./dist/css/nurx.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gp_rename('nurx.min.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('less', function () {
  return gulp.src('./src/less/nurx.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('html', function () {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ["html", "js", "less", "minify-css"], function(){});    