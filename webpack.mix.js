let command = require('node-cmd');

let mix = require('laravel-mix'),
    build = require('./taro.build.js');

mix.disableNotifications();
mix.webpackConfig({
    plugins: [
        build.taro
    ]
});

mix.setPublicPath('./')
    .js('resources/assets/js/app.js', 'dist/assets/js')
    .sass('resources/assets/sass/app.scss', 'dist/assets/css')
    .copy('resources/assets/img/', 'dist/assets/img')
    .options({
        processCssUrls: false
    })
    .version();

// To make this work in a devcontainer:
// https://github.com/laravel-mix/laravel-mix/blob/b116bf064a7aa60dcc05cc9a03edbe9eb3a3ae2f/src/components/BrowserSync.js#L48
// https://github.com/aschmelyun/taro/blob/98914cc2d376756327992034396227470b947bca/webpack.mix.js#L20
// https://www.talvbansal.me/blog/browsersync-with-laravel-mix-and-docker/
// https://stackoverflow.com/questions/42456424/browsersync-within-a-docker-container
// https://github.com/laravel-mix/laravel-mix/blob/master/docs/browsersync.md
mix.browserSync({
    //host: "localhost",
    proxy: null,
    server: "dist",
    port: 3000,
    open: false,
    files: [
        {
            match: ["content/*.json"],
            fn: function (event, file) {
                command.get('php taro build', (error, stdout, stderr) => {
                    console.log(error ? stderr : stdout);
                });
            }
        }
    ]
});