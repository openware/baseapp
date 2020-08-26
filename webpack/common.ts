import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

import { AppConfig } from './config';
import alias from './alias.js';

const rootDir = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(rootDir, 'public');

const config: webpack.Configuration = {
    entry: {
        bundle: [path.resolve(rootDir, 'src/webpack.tsx')],
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        globalObject: 'this',
        publicPath: '/',
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            envType: 'dev',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'src/app/template.html'),
            hash: true,
            chunks: ['common', 'bundle', 'styles'],
        }),
        //new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ru|fr|zh|ko|de|es|it/),
        //new LodashModuleReplacementPlugin({ shorthands: true }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    optimization: {
        moduleIds: 'hashed',
        namedModules: true,
        namedChunks: true,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.(css|sass|scss|pcss)$/,
                    chunks: 'all',
                    enforce: true,
                },
                common: {
                    name: 'common',
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|ttf|eot|woff|svg)$/,
                use: 'url-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: alias.webpack,
    },
    devtool: 'source-map',
    externals: {
        config: JSON.stringify({
            app: AppConfig,
        }),
    },
};

// eslint-disable-next-line import/no-default-export
export default config;
