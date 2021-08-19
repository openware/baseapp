import { HotModuleReplacementPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import merge from 'webpack-merge';
import 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import commonConfig from './common';
const rootDir = path.resolve(__dirname, '..');

const config = merge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({}),
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'src/app/template_dev.html'),
            hash: true,
            chunks: ['common', 'bundle', 'styles'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: ['file-loader'],
            },
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

// eslint-disable-next-line import/no-default-export
export default config;
