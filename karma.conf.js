//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      '../thirdparty/angular/angular.js',
      '../thirdparty/angular/angular-ui-router.js',
      '../thirdparty/angular/angular-mocks.js',
      '../thirdparty/angular/angular-touch.js',
      '../thirdparty/angular/dirPagination/dirPagination.js',
      '../thirdparty/requirejs/require.js',
      '*.js',
      'meta/**/*.js',
      'services/**/*.js',
      'util/**/*.js',
      '../scripts/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ]
  });
};
