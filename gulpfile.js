"use strict";

const gulp = require('gulp');
const del = require('del');
const newer = require('gulp-newer');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const process = require('child_process');
const rename = require('gulp-rename');

const staticDir = './src/main/resources/static/';
const debugDir = './build/resources/main/static/'
const webAppDir = './src/main/client/';

const lib = [
    'core-js/client/shim.min.js',
    'systemjs/dist/system.src.js',
    'systemjs/dist/system-polyfills.src.js',
    'reflect-metadata/Reflect.js',
    'rxjs/**/*.js',
    'zone.js/dist/**',
    '@angular/**/bundles/**'
];

gulp.task('execCommand', () => {
    process.execSync('npm run prod-aot');
});

gulp.task('cp-aot', () => {
    return gulp.src("dist/*.min.js")
        .pipe(gulp.dest(staticDir));
});

gulp.task('cp-index', () => {
    return gulp.src(webAppDir + 'index-aot.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest(staticDir));
});

gulp.task('release', ['clean', 're-library', 'css-replace', 'execCommand', 'cp-aot', 'cp-index', 'clean:aot']);

gulp.task('re-library', () => {
    return gulp.src([
        'core-js/client/shim.min.js',
        'zone.js/dist/**',
        'reflect-metadata/Reflect.js',
    ], { cwd: './node_modules/**' })
        .pipe(newer(staticDir + 'lib/'))
        .pipe(gulp.dest(staticDir + 'lib/'));
});

gulp.task('library', () => {
    return gulp.src(lib, { cwd: './node_modules/**' })
        .pipe(newer(staticDir + 'lib/'))
        .pipe(gulp.dest(staticDir + 'lib/'));
});

gulp.task('clean:aot', () => {
    del([
        webAppDir + '**/*.ngfactory.*',
        webAppDir + '**/*.ngsummary.*',
        webAppDir + '**/*.map',
        webAppDir + '**/*.metadata.*',
        webAppDir + '**/*.js',
        'dist'
    ]);
});

gulp.task('clean', () => {
    del(staticDir);
});

gulp.task('typescript-compile', () => {
    return typescriptComile(staticDir);
});

gulp.task('html-replace', () => {
    return htmlReplace(staticDir);
});

gulp.task('css-replace', () => {
    return cssReplace(staticDir);
});

gulp.task('build', ['typescript-compile', 'library', 'html-replace', 'css-replace']);

gulp.task('watch', function () {
    gulp.watch(webAppDir + '**/*.ts', event => typescriptComile(debugDir));
    gulp.watch(webAppDir + '**/*.html', event => htmlReplace(debugDir));
    gulp.watch(webAppDir + '**/*.scss', event => cssReplace(debugDir));
});

gulp.task('dev', ['build', 'watch']);

function cssReplace(dir) {
    return gulp.src(webAppDir + '**/*.scss')
        .pipe(newer({ dest: staticDir, ext: '.css' }))
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(dir))
}

function htmlReplace(dir) {
    return gulp.src(webAppDir + '**/*.html')
        .pipe(newer(staticDir))
        .pipe(sourcemaps.init())
        .pipe(htmlmin({ collapseWhitespace: true, caseSensitive: true }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(dir))
}

function typescriptComile(dir) {
    let tsProject = ts.createProject('tsconfig.json');
    return gulp.src(['typings/index.d.ts', webAppDir + '**/*.ts'])
        .pipe(newer({ dest: staticDir, ext: '.js' }))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(uglify())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(dir))
}