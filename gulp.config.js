module.exports = function() {
	var root = './';
	var temp = './temp/';

	var config = {
		sassDir: ['app/sass/**/*.scss'],
		cssDir: 'styles',
		cssFile: 'styles/style.css',
		htmltemplates: 'app/**/*.html',
		index: root + 'index.html',
		root: root,
		temp: temp,
		templateCache: {
      file: 'templates.js',
      options: {
          module: 'monsterListApp',
          root: 'app',
          standAlone: false
      }
    },
    js: [
        // 'scripts/**/*.js',
        'app/**/*.module.js',
        // 'app/**/*.js'
    ],
    jsOrder: [
        '**/app.module.js',
        '**/*.module.js',
        '**/*.js'
    ],
    build: 'build',
    optimized: {
        app: 'app.js',
        lib: 'lib.js'
    }
	};

	return config;
};