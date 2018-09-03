var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var notify = require("gulp-notify")
var refresh = require('gulp-refresh');
var browserSync = require('browser-sync').create();
var svgSprite = require("gulp-svg-sprite");
var replace = require("gulp-replace");
var cheerio = require("gulp-cheerio");
var svgmin = require("gulp-svgmin");

gulp.task("svg", function() {
    return gulp.src("../sources/assets/*.svg")
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function($) {
                $("[fill]").removeAttr("fill");
                $("[stroke]").removeAttr("stroke");
                $("[style]").removeAttr("style");
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace("&gt;", ">"))
        .pipe(svgSprite({
            mode:{
                symbol:{
                    sprite:'sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest("./sprite"));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("./scss/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('sass', function(){
	//ftpConnect.remotePath = '/css';
    gulp.src('./scss/**/*.scss')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass())
    .pipe(sourcemaps.write("."))
    //.pipe(ftp(ftpConnect))
    .pipe(gulp.dest('./css'))
    .pipe(notify("SASS Done!"))
    .pipe(refresh())
    .pipe(browserSync.stream());
});


gulp.task('default', ['serve', 'svg']);