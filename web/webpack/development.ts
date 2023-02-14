import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// eslint-disable-next-line import/order
import path from 'path';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import 'webpack-dev-server';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
// eslint-disable-next-line import/no-named-as-default
import merge from 'webpack-merge';
import commonConfig from './common';
const rootDir = path.resolve(__dirname, '..');

const devServer: DevServerConfiguration = {
    compress: false,
    port: 3000,
    historyApiFallback: true,
    static: {
        directory: path.join(__dirname, '../public'),
    },
};

const config: Configuration = merge(commonConfig, {
    mode: 'development',
    output: {
        pathinfo: false,
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({}),
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'src/app/template_dev.html'),
            hash: true,
            chunks: ['common', 'bundle', 'styles'],
        }),
    ],
    optimization: {
        runtimeChunk: true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: ['file-loader'],
            },
            {
                test: /\.(css|sass|scss|pcss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
            },
            {
                test: /\.(tsx|ts)?$/,
                use: [
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
    devServer,
});

// eslint-disable-next-line import/no-default-export
export default config;
