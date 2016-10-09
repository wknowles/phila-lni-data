// if or when this file gets too big - the gulpfile can be split, and a task run from each file.
// include the require-dir module - https://www.npmjs.com/package/require-dir
// see this: http://macr.ae/article/splitting-gulpfile-multiple-files.html

// require gulp
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence');

// gulp task to run browserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  });
});

// gulp task to process sass into css
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass({style: 'expanded', includePaths: ['node_modules/bulma'], errLogToConsole: true })) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer())
    .pipe(gulp.dest('app/css')) // Sets temporary dest of css (for dev - min in dist)
    .pipe(browserSync.reload({ // Tells browserSync to reload when sass changes
      stream: true
    }));
});

// Copy data
gulp.task('data', function(){
  return gulp.src('app/data/*')
    .pipe(gulp.dest('dist/data/'));
});

// gulp task to watch for changes and then run tasks above
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// default task for development - just run `gulp`
gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync', 'data', 'watch'],
    callback
  );
});

//  -------------------------------------------------------   //
//  the tasks below are used when building for distribution   //
//  -------------------------------------------------------   //

// clean up dist folder
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// gulp task to combine, minify and concatenate css & js
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
// Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// gulp task to optimize images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
// Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'));
});

// gulp build to put everything together
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'data'],
    callback
  );
});
