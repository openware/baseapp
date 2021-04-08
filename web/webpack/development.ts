import { HotModuleReplacementPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import merge from 'webpack-merge';
import 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './common';
import serviceWorkerConfig from './service-worker';

const config = merge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',
    plugins: [new HotModuleReplacementPlugin(), new ForkTsCheckerWebpackPlugin({})],
    module: {
        rules: [
            {
                test: /\.(css|sass|scss|pcss)$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                            reloadAll: true,
                        },
                    },
                    'cache-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(tsx|ts)?$/,
                use: [
                    'cache-loader',
                    {
                        loader: 'thread-loader',
                        options: {
                            poolTimeout: Infinity,
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
    devServer: {
        contentBase: path.join(__dirname, '../public'),
        compress: false,
        port: 3000,
        historyApiFallback: true,
        stats: {
            children: false,
        },
        hot: true,
    },
});

module.exports = [config, serviceWorkerConfig];
