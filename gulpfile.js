"use strict";

var config = require('./gulp.config')();
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var argv = require('yargs').argv;
var replace = require('gulp-replace');
// var fs = require('fs');

var dev = argv.dev;

gulp.task('help', $.taskListing);
gulp.task('default', ['inject']);

gulp.task('clean-styles', function (done) {
    clean(config.cssFile, done);
});

gulp.task('clean-code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js'
    );
    clean(files, done);
});

gulp.task('compile-sass', ['clean-styles'], function () {
    log('Compiling SASS --> CSS');

    return gulp
        .src(config.sassDir)
        .pipe($.sass())
        .pipe(gulp.dest(config.cssDir));
});

gulp.task('sass-watcher', function () {
    gulp.watch(config.sassWatchFiles, ['compile-sass']);
});

gulp.task('template-cache', ['clean-code'], function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.order(['*']))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('remove-template', function () {
    log('Removing template');

    return gulp.src(config.index)
        .pipe(replace(
            /(<!-- inject:templates:js -->)(?:[\S\s]*?)(<!-- endinject -->)/gmi,
            '$1\r\n\t$2'
        ))
        .pipe(gulp.dest(config.root));
});

// If we're in dev mode, the template.js file will be removed from index.html
var injectDependencies = ['compile-sass'];
if ( dev ) {
    injectDependencies.push('remove-template');
} else {
    injectDependencies.push('template-cache');
}

gulp.task('inject', injectDependencies, function () {
    log('Wire up css and js into the html, after files are ready');

    var result =  gulp
        .src(config.index)
        .pipe(inject(config.cssFile))
        .pipe(inject(config.js, '', config.jsOrder));

    // Only put in the template cache if we're not in dev mode
    if ( !dev ) {
        var templateCache = config.temp + config.templateCache.file;
        result = result.pipe(inject(templateCache, 'templates'));
    }

    result = result.pipe(gulp.dest(config.root));

    return result;
});

gulp.task('clean-build', function(done) {
    clean(config.buildFiles, done);
});

gulp.task('optimize', ['inject', 'clean-build'], function () {
    // TODO: JS filter temporarily disabled until the dependency injection issue is resolved
    var cssFilter = $.filter('./styles/*.css', {restore: true});
    // var jsAppFilter = $.filter('**/' + config.optimized.app, {restore: true});
    var indexHtmlFilter = $.filter(['**/*', '!**/index.html'], { restore: true });
    return gulp
        .src(config.index)
        .pipe($.useref())
        .pipe(cssFilter)
            .pipe($.csso())
            .pipe(cssFilter.restore)
        // .pipe(jsAppFilter)
        //     .pipe($.uglify())
        //     .pipe(jsAppFilter.restore)
        .pipe(indexHtmlFilter)
            .pipe($.rev())
            .pipe(indexHtmlFilter.restore)
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
});

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, { force: true }).then(paths => done());
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function inject(src, label, order) {
    var options = { addRootSlash: false };
    if (label) {
        options.name = 'inject:' + label;
    }

    return $.inject(orderSrc(src, order), options).on('error', log);
}

function orderSrc(src, order) {
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}
