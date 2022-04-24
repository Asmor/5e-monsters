// webpack.mix.js

let mix = require('laravel-mix');

mix.browserSync({
    server: "./docs",
    files: [
        "docs/*"
    ]
});

mix.copy('src/index.html', 'docs/index.html');
mix.copy('src/manifest.json', 'docs/manifest.json');
mix.copy('src/json/*', 'docs/json/');
mix.copy('src/images/*', 'docs/images/');
mix.js('src/js/app.js', 'docs/js/app.js').setPublicPath('docs');

mix.postCss('src/css/kobold.css', 'docs/css/styles.css', [
    require("tailwindcss"),
]);