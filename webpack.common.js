const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const PUBLIC_PATH = 'http://localhost:8080/';
// const PUBLIC_PATH = 'https://filla.id/covid-19/';

module.exports = {
    entry: [
        'babel-polyfill',
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: PUBLIC_PATH
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass'),
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
            filename: 'index.html'
        }),
        new FaviconsWebpackPlugin({
            logo: './src/logo.png',
            cache: true,
            inject: true,
            prefix: 'icons',
            publicPath: PUBLIC_PATH,
            favicons: {
                appName: 'covid19',
                appDescription: 'Covid19 data tracker',
                developerName: 'mkhaufillah',
                developerURL: 'https://filla.id/',
                background: '#000',
                theme_color: '#fff',
                icons: {
                    coast: false,
                    yandex: false
                }
            }
        })
    ]
}