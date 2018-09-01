var gulp           = require('gulp');
var scss           = require('gulp-sass');
var less           = require('gulp-less');
var image          = require('gulp-image');
var uglify         = require('gulp-uglify');
var cssnano        = require('gulp-cssnano');
var htmlmin        = require('gulp-htmlmin');
var changed        = require('gulp-changed');
var autoprefixer   = require('gulp-autoprefixer');
var prettify       = require('gulp-jsbeautifier');
var runSequence    = require('run-sequence');
var serveStatic    = require('serve-static');
var compression    = require('compression');
var express        = require('express');
var http           = require('http');
var del            = require('del');
var imageResize	   = require('gulp-image-resize');
var gulpIgnore     = require('gulp-ignore');
var sizeOf         = require('image-size');

// image optimization

var imgPrefs = {
	pngquant: true,
	optipng: true,
	zopflipng: true,
	jpegRecompress: true,
	mozjpeg: true,
	guetzli: false,
	gifsicle: false,
	svgo: true,
	concurrent: 10
};

// server

gulp.task('server', function() {
	var app = express();
	app.use(compression())
	app.use(serveStatic('./dist', {
		'extensions': ['html'],
		'maxAge': 3600000
	}))
	var server = http.createServer(app);
	server.listen(8888);
	console.log("http://localhost:8888");
})

// scss compilation + minification

gulp.task('scss', function () {
	return gulp.src('src/**/*.scss')
	.pipe(changed('dist', {extension: '.css'}))
	.pipe(scss())
	.pipe(autoprefixer({
		browsers: ['>1%'],
		cascade: false
	}))
	.pipe(cssnano())
	.pipe(gulp.dest('dist'))
})

// less compilation + minification

gulp.task('less', function () {
  return gulp.src('src/**/*.less')
    .pipe(changed('dist', {extension: '.css'}))
    .pipe(less())
    .pipe( autoprefixer({
            browsers: ['>1%'],
            cascade: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
})

// css minification

gulp.task('css', function() {
	return gulp.src('src/**/*.css')
	.pipe(changed('dist'))
	.pipe(autoprefixer({
		browsers: ['>1%'],
		cascade: false
	}))
	.pipe(cssnano())
	.pipe(gulp.dest('dist'))
})

// js minification + uglification

gulp.task('js', function() {
	return gulp.src('src/**/*.js')
	.pipe(changed('dist'))
	.pipe(uglify())
	.pipe(gulp.dest('dist'))
})

// image optimization

gulp.task('images', function() {
	return gulp.src('src/**/*.{png,jpg,jpeg,gif,svg}')
	.pipe(changed('dist'))
	.pipe(image(imgPrefs))
	.pipe(gulp.dest('dist'))
})

// make placeholders

gulp.task('placeholders', function() {
  return gulp.src('src/images/**/*.{jpg,jpeg,png,gif}')
    .pipe(changed('dist/images/placeholders'))    
    .pipe(imageResize({
      noProfile: true,
      width : 40,
      quality: 0
    }))
    .pipe(image(imgPrefs))
    .pipe(gulp.dest('dist/images/placeholders'))
})

// image resizing

var lt300 = function (file) {
    var dimensions = sizeOf(file.path);
    if(dimensions.width > 300) {
        return false;
    }else{
        return true;
    }
};

var lt400 = function (file) {
    var dimensions = sizeOf(file.path);
    if(dimensions.width > 400) {
        return false;
    }else{
        return true;
    }
};

var lt500 = function (file) {
    var dimensions = sizeOf(file.path);
    if(dimensions.width > 500) {
        return false;
    }else{
        return true;
    }
};

gulp.task('resize300', function() {
  return gulp.src('src/images/**/*.{jpg,jpeg,png,gif}')
    .pipe(changed('dist/images/300'))
    .pipe(gulpIgnore(lt300))
    .pipe(imageResize({
      width : 300
    }))
    .pipe(image(imgPrefs))
    .pipe(gulp.dest('dist/images/300'))
})

gulp.task('resize400', function() {
  return gulp.src('src/images/**/*.{jpg,jpeg,png,gif}')
    .pipe(changed('dist/images/400'))
    .pipe(gulpIgnore(lt400))
    .pipe(imageResize({
      width : 400
    }))
    .pipe(image(imgPrefs))
    .pipe(gulp.dest('dist/images/400'))
})

gulp.task('resize500', function() {
  return gulp.src('src/images/**/*.{jpg,jpeg,png,gif}')
    .pipe(changed('dist/images/500'))
    .pipe(gulpIgnore(lt500))
    .pipe(imageResize({
      width : 500
    }))
    .pipe(image(imgPrefs))
    .pipe(gulp.dest('dist/images/500'))
})

// html minification

gulp.task('html', function() {
	return gulp.src('src/**/*.html')
	.pipe(changed('dist'))
	.pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true,
		minifyCSS: true,
		minifyJS: true
	}))
	.pipe(gulp.dest('dist'))
})

// copy everything else

gulp.task('other', function() {
	return gulp.src(['src/**/*.*', '!src/**/*.html', '!src/**/*.css', '!src/**/*.js', '!src/**/*.less', '!src/**/*.scss', '!src/**/*.png', '!src/**/*.jpg', '!src/**/*.jpeg', '!src/**/*.gif', '!src/**/*.svg' ])
	.pipe(changed('dist'))
	.pipe(gulp.dest('dist'))
})

// Prettify css js html

gulp.task('prettify:src', function() {
	return gulp.src('src/**/*.+(html|css|js|less|scss)')
	.pipe(prettify())
	.pipe(gulp.dest('src'))
})


// Cleaning

gulp.task('clean', function() {
	return del.sync('dist')
})

gulp.task('clean:code', function() {
	return del.sync(['dist/**/*.*', '!dist/**/*.png', '!dist/**/*.jpg', '!dist/**/*.jpeg', '!dist/**/*.gif', '!dist/**/*.svg'])
})

// Build

gulp.task('build', function(callback) {
	runSequence(
		'scss',
		'less',
		'css',
		'js',
		'images',
		'placeholders',
		'resize300',
		'resize400',
		'resize500',
		'html',
		'other',
		callback
	)
})

// Watch

gulp.task('watch', function() {
gulp.watch('src/**/*', ['build'])
})

// Gulp - Build + Watch + start-servers

gulp.task('default', function(callback) {
	runSequence(
		'build',
		'watch',
		'server',
		callback
	)
})