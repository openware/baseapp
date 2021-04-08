import webpack from 'webpack';
import path from 'path';

import alias from './alias.js';

const rootDir = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(rootDir, 'public');

const config: webpack.Configuration = {
    entry: {
        bundle: [path.resolve(rootDir, 'src/service-worker.ts')],
    },
    output: {
        path: BUILD_DIR,
        filename: 'service-worker.js',
        globalObject: 'this',
        publicPath: '/',
    },
    plugins: [],
    optimization: {},
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: alias.webpack,
    },
    externals: {},
};

// eslint-disable-next-line import/no-default-export
export default config;
