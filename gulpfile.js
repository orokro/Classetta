// Let's load all the required gulp-plugins we'll be using and store them to vars ahead of time
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel');


// Now we should set up some variables to hold the file pathes for our project
var jsSources = ['js_raw/*.js'],
    sassSources = ['sass/*.scss'],
    mainSass = ['sass/style.scss'],
    htmlSources = ['*.html'],
    outputCSS = 'compiled/css/',
    outputJS = 'compiled/js/';


// Copy a file to our output directory (Another example function basically)
gulp.task('copy', function() {
    gulp.src('index.html')
    .pipe(gulp.dest(outputDir))
});



// IMPORTANT FUNCTIONS START HERE! +++ IMPORTANT FUNCTIONS START HERE! +++ IMPORTANT FUNCTIONS START HERE! 
// IMPORTANT FUNCTIONS START HERE! +++ IMPORTANT FUNCTIONS START HERE! +++ IMPORTANT FUNCTIONS START HERE! 

// Compile our SASS files from the sassSources variable,
// Then reload our live server
gulp.task('sass', function() {
    gulp.src(mainSass)
    .pipe(plumber())
    .pipe(sass({style: 'expanded'}))
        .on('error', gutil.log)
    .pipe(gulp.dest(outputCSS))
    .pipe(connect.reload())
});

// Compile Babel ES6, Minify & Concatenate, Our JS files from the jsSources variable,
// And reload the live server
gulp.task('js', function() {
    gulp.src(jsSources)
    .pipe(plumber())
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest(outputJS))
    .pipe(connect.reload())
});

// Set up our watches so we can laze around and watch for changes!
gulp.task('watch', function() {
    //gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch(sassSources, ['sass']);
    gulp.watch(htmlSources, ['html']);
});

// Set up our localhost live server (on port 8080!)
gulp.task('connect', function() {
    connect.server({
        root: 'compiled/',
        livereload: true
    })
});

// Bonuse task for watching HTML files and reloading the live server if they change
gulp.task('html', function() {
    gulp.src(htmlSources)
    .pipe(gulp.dest('compiled'))
    .pipe(connect.reload())
});

// Last but not least, let's mnake the default tast of the 'gulp' CLI command to set up our watchs and server!
gulp.task('default', ['html', 'js', 'sass', 'connect', 'watch']);
