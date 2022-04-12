// webpack.mix.js

let mix = require('laravel-mix');

mix.browserSync({
    server: "./docs",
    files: [
        "docs/*"
    ]
});

mix.copy('src/index.html', 'docs/index.html');
mix.copy('src/json/*', 'docs/json/');
mix.js('src/js/app.js', 'docs/js/app.js').setPublicPath('docs');

mix.postCss('src/css/kobold.css', 'docs/css/styles.css', [
    require("tailwindcss"),
]);