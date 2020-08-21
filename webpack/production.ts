import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import merge from 'webpack-merge';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(rootDir, 'build');

import commonConfig from './common';

const config = merge(commonConfig, {
    mode: 'production',
    output: {
        path: BUILD_DIR,
        filename: '[name].js',
        globalObject: 'this',
        publicPath: '/',
    },
    plugins: [
        new webpack.ExtendedAPIPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: false,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
