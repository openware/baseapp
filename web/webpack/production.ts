import CopyWebpackPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// eslint-disable-next-line import/order
import path from 'path';
import { DefinePlugin } from 'webpack';
// eslint-disable-next-line import/no-named-as-default
import merge from 'webpack-merge';
import WebpackObfuscator from 'webpack-obfuscator';
import commonConfig from './common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const rootDir = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(rootDir, 'build');

const domain = process.env.BUILD_DOMAIN ? process.env.BUILD_DOMAIN.split(',') : [];

const plugins = [
    new DefinePlugin({ 'process.env.BUILD_EXPIRE': JSON.stringify(process.env.BUILD_EXPIRE) }),
    new HtmlWebpackPlugin({
        template: path.resolve(rootDir, 'src/app/template.html'),
        hash: true,
        chunks: ['common', 'bundle', 'styles'],
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
    }),
    new CopyWebpackPlugin({
        patterns: [{ from: 'public' }],
    }),
    new WebpackObfuscator({ rotateStringArray: true, domainLock: domain }),
];

if (process.env.ANALYZE === '1') {
    plugins.push(new BundleAnalyzerPlugin());
}

const config = merge(commonConfig, {
    mode: 'production',
    output: {
        path: BUILD_DIR,
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    optimization: {
        usedExports: false,
        minimizer: [new CssMinimizerPlugin()],
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.(css|sass|scss|pcss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'postcss-loader'],
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
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts',
                        },
                    },
                ],
            },
            {
                test: /\.(js)?$/,
                exclude: /node_modules/,
                enforce: 'post',
                use: {
                    loader: WebpackObfuscator.loader,
                    options: {
                        rotateStringArray: true,
                    },
                },
            },
        ],
    },
    stats: {
        children: false,
    },
});

// eslint-disable-next-line import/no-default-export
export default config;
