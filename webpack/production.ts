import { ExtendedAPIPlugin, DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import merge from 'webpack-merge';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import JavaScriptObfuscator from 'webpack-obfuscator';
// import CompressionPlugin from 'compression-webpack-plugin';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const rootDir = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(rootDir, 'build');

import commonConfig from './common';

const domain = process.env.BUILD_DOMAIN ? process.env.BUILD_DOMAIN.split(',') : [];

const config = merge(commonConfig, {
    mode: 'production',
    output: {
        path: BUILD_DIR,
        filename: '[name].[hash].js',
        globalObject: 'this',
        publicPath: '/',
    },
    optimization: {
        usedExports: false,
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/,
            }),
        ],
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new ExtendedAPIPlugin(),
        new DefinePlugin({ 'process.env.BUILD_EXPIRE': JSON.stringify(process.env.BUILD_EXPIRE) }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: false,
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'public' }],
        }),
        new JavaScriptObfuscator({ rotateUnicodeArray: true, domainLock: domain }),
        // new CompressionPlugin({
        //     filename: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: /\.js$|\.css$|\.html$/,
        //     threshold: 10240,
        //     minRatio: 0.8,
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.(css|sass|scss|pcss)$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'postcss-loader'],
            },
            {
                test: /\.(tsx|ts)?$/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            poolTimeout: 2000,
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            happyPackMode: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    stats: {
        children: false,
    },
});

// eslint-disable-next-line import/no-default-export
export default config;
