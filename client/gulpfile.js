const gulp = require('gulp'),
    del = require('del'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    postcss = require('gulp-postcss'),
    gulpSequence = require('gulp-sequence'),
    cache = require('gulp-cached'),
    autoprefixer = require('autoprefixer'),
    tslint = require("gulp-tslint"),
    watch = require('gulp-watch'),
    tscConfig = require('./tsconfig.json');

const SRC = "src",
    DEST = "dev",
    PATHS = {
        external_libs: [
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/three/three.js'
        ],
        dest: {
            base: DEST,
            lib: DEST+'/lib',
            assets: DEST+'/app/assets',
            index: DEST+'/index.html',
            css: DEST+'/app/**/*.css'
        },
        src: {
            base: SRC,
            scripts: SRC+'/**/*.ts',
            css: SRC+'/**/*.css',
            assets: SRC+'/assets/**/*',
            index: SRC+'/index.html',
            electron: [SRC+'/electron.js', SRC+'/package.json']
        }
    },
    INDEX_INJECT_LIST = [
        PATHS.dest.lib+'/**/system*.js', 
        PATHS.dest.lib+'/**/*.js', 
        PATHS.dest.lib+'/**/*.css', 
        PATHS.dest.css
    ];


gulp.task('clean', () => {
    return del(PATHS.dest.base+'/**/*');
});


gulp.task('libs', () => {
    return gulp.src(PATHS.external_libs)
        .pipe(cache('libs'))
        .pipe(gulp.dest(PATHS.dest.lib));
});


gulp.task('scripts', () => {
    return gulp.src(PATHS.src.scripts)
        .pipe(cache('scripts'))
        .pipe(tslint())
        .pipe(tslint.report("prose", {
            emitError: false
        }))
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS.dest.base));
});


gulp.task('css', () => {
    var processors = [
        autoprefixer({browsers: ['last 1 version']})
    ];
    return gulp.src(PATHS.src.css)
        .pipe(cache('css'))
        .pipe(postcss(processors))
        .pipe(gulp.dest(PATHS.dest.base));
})


gulp.task('assets', () => {
    return gulp.src(PATHS.src.assets)
        .pipe(cache('assets'))
        .pipe(gulp.dest(PATHS.dest.assets));
});


gulp.task('compile_index', () => {
    var target = gulp.src(PATHS.dest.index);
    var sources = gulp.src(INDEX_INJECT_LIST, {read: false});
    
    return target.pipe(inject(sources, {ignorePath: PATHS.dest.base, addRootSlash: false}))
        .pipe(gulp.dest(PATHS.dest.base))
        .pipe(connect.reload());
});


gulp.task('copy_index', () => {
    return gulp.src(PATHS.src.index)
        .pipe(gulp.dest(PATHS.dest.base));
});


gulp.task('electron', () => {
    return gulp.src(PATHS.src.electron)
        .pipe(gulp.dest(PATHS.dest.base));
});


gulp.task('serve', () => {
    connect.server({
        root: PATHS.dest.base,
        livereload: true
    });
});


gulp.task('watch', () => {
    watch([
            PATHS.src.scripts,
            PATHS.src.css,
            PATHS.src.index,
        ], () => { 
            gulp.start('reload')
    });
});


gulp.task('reload', ['scripts', 'css', 'copy_index'], () => {
    gulp.start('compile_index');
});


//-----------------------------//

gulp.task('dev', 
    gulpSequence(
        'clean',
        ['assets', 'electron', 'scripts', 'css', 'libs', 'copy_index'],
        'compile_index',
        'serve',
        'watch'
    )
);

gulp.task('default', ['dev']);
