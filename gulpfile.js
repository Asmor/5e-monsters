var config = require('./gulp.config')();
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var fs = require('fs');

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
    gulp.watch(config.sassDir, ['compile-sass']);
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

gulp.task('inject', ['compile-sass', 'template-cache'], function () {
    log('Wire up css and js into the html, after files are ready');

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe(inject(config.cssFile))
        .pipe(inject(config.js, '', config.jsOrder))
        .pipe(inject(templateCache, 'templates'))
        .pipe(gulp.dest(config.root));
});


gulp.task('optimize', ['inject'], function () {
    var cssFilter = $.filter('./styles/*.css', {restore: true});
    var jsAppFilter = $.filter('**/' + config.optimized.app, {restore: true});
    var indexHtmlFilter = $.filter(['**/*', '!**/index.html'], { restore: true });
    return gulp
        .src(config.index)
        .pipe($.useref())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(jsAppFilter)
        .pipe($.uglify())
        .pipe(jsAppFilter.restore)
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
