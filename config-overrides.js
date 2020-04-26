const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push(new webpack.DefinePlugin({ 'process.env.BUILD_EXPIRE': JSON.stringify(process.env.BUILD_EXPIRE) }));

    const version = process.env.REACT_APP_GIT_SHA || 'snapshot';
    const commonJSFilename = `commons.${version}.js`;

    if (process.env.NODE_ENV === 'production') {
        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        chunks: "initial",
                        minChunks: 1,
                        name: "commons",
                        filename: commonJSFilename,
                        enforce: true
                    }
                }
            }
        }

        const domain = process.env.BUILD_DOMAIN ? process.env.BUILD_DOMAIN.split(',') : [];

        config.plugins.push(
           // new JavaScriptObfuscator({ rotateUnicodeArray: true, domainLock: domain }, [commonJSFilename])
        );

        config.plugins.push(
            new CompressionPlugin({
                filename: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            })
        );
    }

    return config;
};
