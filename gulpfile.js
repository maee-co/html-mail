var gulp = require('gulp');
var ejs = require('gulp-ejs');
var sass = require('gulp-sass');
var inlineCss = require('gulp-inline-css');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var rename = require( 'gulp-rename' );

var dir = {
  src: 'src',
  dist: 'dist'
}

var options = {
  ejs: {},
  sass: {
    outputStyle: 'expanded'
  },
  inlineCss: {
    applyStyleTags: false,
    removeStyleTags: false
  },
  htmlmin: {
    removeComments: true,
    collapseWhitespace: true
  },
  serve: {
    open: true,
    notify: false,
    startPath: 'dist',
    server: {
      baseDir: './',
      index: `${dir.dist}/`,
      routes: {
          ['']: `${dir.dist}/`
      }
    }
  }
}


gulp.task('ejs', function() {
  return gulp.src([`./${dir.src}/template/**/*.ejs`, `!./${dir.src}/template/**/_*.ejs`])
    .pipe(ejs(options.ejs))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(`./${dir.dist}/`));
});

gulp.task('sass', function() {
  return gulp.src(`./${dir.src}/sass/**/*.scss`)
    .pipe(sass(options.sass))
    .pipe(gulp.dest(`./${dir.dist}/css/`));
});

gulp.task('inlineCss', function() {
  return gulp.src(`${dir.dist}/*.html`)
    .pipe(inlineCss(options.inlineCss))
    .pipe(gulp.dest(`${dir.dist}`));
});

gulp.task('htmlmin', function() {
  return gulp.src(`./${dir.dist}/**/*.html`)
    .pipe(htmlmin(options.htmlmin))
    .pipe(gulp.dest(`./${dir.dist}/`));
});

gulp.task('serve', function() {
  browserSync(options.serve);
});

gulp.task('build', function(cb) {
  runSequence(
    'ejs',
    'sass',
    'inlineCss',
    'htmlmin',
    cb
  );
});

gulp.task('default', ['build', 'serve'], function() {
    gulp.watch(`./${dir.src}/template/**/*.ejs`, ['build', browserSync.reload]);
    gulp.watch(`./${dir.src}/sass/**/*.scss`, ['build', browserSync.reload]);
});
