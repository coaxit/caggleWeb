/**
 *  Requirements
 *  Here we list all required gulp-plugins to run our tasks.
 */

// gulp - quite the obvious requirement
var gulp = require('gulp');

// gulp-plumber: for error-handling in pipes
var plumber = require('gulp-plumber');

// Various advanced tools for building better gulp tasks
var lazypipe = require('lazypipe');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');

// some useful tools for more complex chains and stuff
var argv = require('minimist')(process.argv.slice(2));
var _if = require('gulp-if');
var fs = require('fs');
var ignore = require('gulp-ignore');

// actual content handling
var sass = require('gulp-sass');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');

// Source Maps
var sourcemaps = require('gulp-sourcemaps');

// browserSync: the visible strength of this process
var browserSync = require('browser-sync').create();

// we build our own optimized modernizr
var modernizr = require('gulp-modernizr');
var source = require('vinyl-source-stream');


/**
 * General TODOs
 * TODO: Add sourcemaps and describe workflow in Insight
 * TODO: Add caching
 * TODO: Are we using gulp2 yet? Should we be using it?
 */


/**
 * Command line options
 *
 * kha: the --production parameter can be used to enable minification for JS and CSS. It should be
 * used with care as we are using some pretty aggressive default optimization settings right now and JS
 * as well as CSS might potentially break. We're gaining massive improvements in filesize, though.
 * Be sure to test the site with the production files before you deploy them.
 *
 * TODO: Add a config.xml or environment based switch between the different versions in templates.
 * TODO: Add images and fonts to production, maybe with more aggressive optimization.
 */
var enabled = {
    // enable production behaviour when --production flag is set
    production: argv.production
};

/* Read the manifest.json file from the assets directory for use within our build pipeline */
var manifest = require('asset-builder')('assets/manifest.json');

/* List of generally watched files */
var watchGlobs = manifest.config.watchGlobs;


/**
 *  default
 *  The default task which is run when we only call 'gulp' from the command line
 *  Here we start watching for file changes while at the same time building all assets once.
 */
gulp.task('default', ['watch', 'build'], function () {
});

/**
 * cssPipe
 *
 * This lazyPipe compiles and concatenates SCSS, LESS and CSS files.
 * It is called by the 'css' gulp task.
 *
 * @param filename
 * @returns {*}
 */
var cssPipe = function (filename) {
    return lazypipe()
        .pipe(function () {
            return plumber(); // we use gulp-plumber to emit an 'error' event to be used later
        })
        .pipe(function () { // compile sass
            return _if('*.scss', sass({
                errorLogToConsole: false
            }));
        })
        .pipe(function () { // compile sass
            return _if('*.sass', sass({
                errorLogToConsole: false
            }));
        })
        .pipe(function () { // compile less
            return _if('*.less', less({}));
        })
        .pipe(function () { // compile anything
            return concat(filename);
        })();
};

/**
 * css
 *
 * Here we build the combined CSS from our own SCSS/LESS files and vendor-specific CSS.
 * With the wiredep task we inject bower_components' SASS/LESS in the main files beforehand.
 */
gulp.task('css', ['wiredep'], function () {
    var merged = merge(); // Use merge() to combine the output of the cssPipe sub-pipes.

    /* Iterate over our CSS dependencies and use lazypipes to generate output */
    manifest.forEachDependency('css', function (dep) {
        console.log('Building CSS: ' + dep.name);
        // console.log('from ' + dep.globs);

        /*
         We instantiate the cssPipe lazypipe to be able to
         react to an 'error' event gracefully using plumber.
         */
        var cssPipeInstance = cssPipe(dep.name);
        cssPipeInstance.on('error', function (err) {
            console.log(err.message);
            this.emit('end');
        });

        /*
         We merge all cssPipe lazypipes into one giant stream.
         */
        merged.add(
        gulp.src(dep.globs)
            .pipe(sourcemaps.init())
            .pipe(cssPipeInstance)
            .pipe(sourcemaps.write(manifest.paths.sourceMaps, {debug: true}))
            .pipe(gulp.dest(manifest.paths.dist + 'css')) // write out css dependencies to the dist folder
            .pipe(_if(enabled.production, ignore.exclude([manifest.paths.sourceMaps + '/*'])))
            .pipe(browserSync.stream())
            .pipe(
                _if(enabled.production, cleanCSS({}))
            )
            .pipe(
                _if(enabled.production, gulp.dest(manifest.paths.distProduction + 'css'))
            ));
    });

    return merged;
});


/**
 * wiredep
 *
 * This task allows us to use bower's wiredep functionality to directly
 * insert bower_components' SASS into our main SASS file.
 */
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    return gulp.src(manifest.paths.source + manifest.config.wiredepStylesheet)
        .pipe(wiredep())
        .pipe(gulp.dest(manifest.paths.source + manifest.config.wiredepDirectory));
});

/**
 *  js
 *
 *  Here we build our JavaScript files using asset-builder.
 */
gulp.task('js', function () {
    /* We run through all asset-builder dependencies with a '*.js' name
     and build our JavaScript distribution from them.
     */
    manifest.forEachDependency('js', function (dep) {
        gulp.src(dep.globs)
            .pipe(sourcemaps.init())
            .pipe(concat(dep.name))
            .pipe(sourcemaps.write(manifest.paths.sourceMaps))
            .pipe(gulp.dest(manifest.paths.dist + 'js'))
            .pipe(_if(enabled.production, ignore.exclude([manifest.paths.sourceMaps + '/*'])))
            .pipe(_if(enabled.production, uglify()))
            .pipe(_if(enabled.production, gulp.dest(manifest.paths.distProduction + 'js')))
    });

    /* After building JavaScript we always want to reload browserSync */
    browserSync.reload();
});

/**
 * fonts
 *
 * Grabs all the fonts and outputs them in a flattened directory
 * structure. See: https://github.com/armed/gulp-flatten
 */
gulp.task('fonts', function () {
    return gulp.src(manifest.globs.fonts)
        .pipe(gulp.dest(manifest.paths.dist + 'fonts'))
        .pipe(_if(enabled.production, gulp.dest(manifest.paths.distProduction + 'fonts')))
});

/**
 * Images
 *
 * Grab all image assets, optimize for filesize and put them in dist directory
 */
gulp.task('images', function () {
    return gulp.src(manifest.globs.images)
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}]
        }))
        .pipe(gulp.dest(manifest.paths.dist + 'images'))
        .pipe(_if(enabled.production, gulp.dest(manifest.paths.distProduction + 'images')));
});

/**
 *  reload
 *
 *  This task is used to react to changes in the IRPages2 templates and
 *  reload the browser accordingly.
 */
gulp.task('reload', function () {
    browserSync.reload();
});

/**
 *  build
 *
 *  This global build tasks runs through all builders to create a complete distribution.
 */
gulp.task('build', ['css', 'js', 'fonts', 'images']);

/**
 *  buildProduction
 *
 *  This task runs the build taks, but with the production flag enabled. It additionally
 *  cleans the dist directories beforehand.
 */
gulp.task('buildProduction', function () {
    enabled.production = true;

    runSequence('clean', 'build');
});

/**
 *  watch
 *
 *  This task watches files for changes and calls the appropriate tasks if necessary.
 */
gulp.task('watch',['css', 'js', 'fonts', 'images'], function () {

    /* Initialize browserSync
     @proxy: the root domain that browserSync will proxy to localhost:[port]
     */
    browserSync.init({
        /*proxy: "http://" + manifest.config.subdomainProxyURL,*/
        server: {
            baseDir: ''
        }
    });

    /* CSS file watcher */
    gulp.watch(manifest.paths.source + '**/*.scss', ['css']);
    gulp.watch(manifest.paths.source + '**/*.less', ['css']);
    gulp.watch(manifest.paths.source + '**/*.css', ['css']);

    //Image file watcher
    gulp.watch(manifest.paths.source + 'images/*', ['images']);

    //Fonts file watcher
    gulp.watch(manifest.paths.source + 'fonts/*', ['fonts']);

    /* JS file watcher */
    gulp.watch(manifest.paths.source + '**/*.js', ['js']);


    /* TODO: add image filewatcher maybe? */

    /* Watch assets files */
    gulp.watch(['bower.json', 'assets/manifest.json'], ['js', 'css']);

    /* Watch general files */
    gulp.watch(watchGlobs, ['reload']);
});


/**
 * clean
 *
 * Empty '/dist' and '/dist-production' directories (or whatever they are set to)
 */
gulp.task('clean', function () {
    return gulp.src([manifest.paths.distProduction, manifest.paths.dist], {read: false})
        .pipe(clean());
});

/**
 * Modernizr
 *
 * Build a custom modernize version
 */
gulp.task('modernizr', function () {
    // just a filename
    var modernizrFile = manifest.paths.source + 'vendor/modernizr.js';

    // write empty file so we can use it in gulp.src later on
    fs.writeFileSync(modernizrFile, '');

    // render moderizr and write to assets/vendor
    gulp.src(modernizrFile)
        .pipe(modernizr(manifest.config.modernizrOptions))
        .pipe(gulp.dest(manifest.paths.source + 'vendor'));
});
