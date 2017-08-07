module.exports = function() {
	var root = './';
	var temp = './temp/';
    var build = 'build';

	var config = {
		sassDir: ['app/sass/**/*.scss'],
        sassWatchFiles: ['app/**/*.scss'],
		cssDir: 'styles',
		cssFile: 'styles/style.css',
		htmltemplates: 'app/**/*.html',
		index: root + 'index.html',
		root: root,
		temp: temp,
		templateCache: {
            file: 'templates.js',
            options: {
                module: 'app',
                root: 'app',
                standAlone: false
            }
        },
        js: [
            'scripts/**/*.js',
            'app/**/*.module.js',
            'app/**/*.js',
            '!app/**/*.tests.js',
            '!scripts/**/*.tests.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        build: build,
        buildFiles: [build + '/styles/*', build + '/js/*', build + '/index.html'],
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        }
	};

	return config;
};
