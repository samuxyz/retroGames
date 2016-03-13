var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('css-min', function(){
	return gulp.src(['public/css/angular-toastr.css', 'public/css/bootstrap-social.css', 'public/css/signin.css', 'public/css/template.css'])
		.pipe(minifyCSS())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public/css/min'));
});
gulp.task('css-concat', function(){
	return gulp.src('public/css/min/**.css')
		.pipe(concat('style.css'))
		.pipe(gulp.dest('public/css'));
});
gulp.task('js-toastr-min', function(){
	return gulp.src('public/js/angular-toastr.tpls.js')
		.pipe(minify())		
		.pipe(gulp.dest('public/js'));
});
gulp.task('js-lib', function(){
	return gulp.src([
		'public/js/min/jquery.min.js',
		'public/js/min/bootstrap.min.js',
		'public/js/min/angular.min.js',
		'public/js/min/angular-route.min.js',
		'public/js/min/angular-toastr.tpls.min.js',
		'public/js/min/angular-resource.min.js',
		'public/js/min/satellizer.min.js',		
		])
		.pipe(concat('lib.js'))
		.pipe(gulp.dest('public/js'));
});

gulp.task('js-angular', function(){
	return gulp.src(['public/*.js','public/controllers/*.js', 'public/services/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(ngAnnotate())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

gulp.task('watch', function(){
	gulp.watch('public/css/**', ['css-min', 'css-concat']);
	
	gulp.watch(['public/*.js','public/controllers/*.js', 'public/services/*.js'], ['js-angular', 'js-lib']);
});