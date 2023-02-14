import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import path from 'path';
// eslint-disable-next-line import/order
import { Configuration, EnvironmentPlugin, IgnorePlugin, ProvidePlugin } from 'webpack';

import alias from './alias.js';
import { AppConfig } from './config';

const rootDir = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(rootDir, 'public');

const config: Configuration = {
    entry: {
        bundle: [path.resolve(rootDir, 'src/index.tsx')],
    },
    output: {
        path: BUILD_DIR,
        filename: '[path][name].js',
        publicPath: '/',
    },
    plugins: [
        new EnvironmentPlugin({
            envType: 'dev',
        }),
        new IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/,
        }),
        new LodashModuleReplacementPlugin({ shorthands: true, flattening: true, paths: true }),
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    optimization: {
        usedExports: false,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'style',
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
                test: /\.(png|jpg|gif|svg)$/,
                use: 'url-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: alias.webpack,
    },
    externals: {
        config: JSON.stringify({
            app: AppConfig,
        }),
    },
};

// eslint-disable-next-line import/no-default-export
export default config;
