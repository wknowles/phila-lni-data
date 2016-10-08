var gulp = require('gulp');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


var bases = {
    app: 'app/',
    dist: 'dist/'
};

var paths = {
    scripts: ['js/**/*.js'],
    styles: ['css/**/*.css'],
    html: ['*.html','index.html', '404.html'],
    data: ['data/*'],
};

// Delete the dist directory
gulp.task('clean', function() {
    return gulp.src(bases.dist)
    .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
    gulp.src(paths.scripts, {cwd: bases.app})
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(bases.dist + 'js/'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
 // Copy html
    gulp.src(paths.html, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));

 // Copy styles
    gulp.src(paths.styles, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'css'));

 // Copy data
    gulp.src(paths.data, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'data'));
});

// Define the default task as a sequence of the above tasks
gulp.task('default', ['clean', 'scripts', 'copy']);

// A development task to run anytime a file changes
gulp.task('watch', function() {
    gulp.watch('app/**/*', ['js', 'copy']);
});
