const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack = require('webpack');

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push(new webpack.DefinePlugin({ 'process.env.BUILD_EXPIRE': JSON.stringify(process.env.BUILD_EXPIRE) }));
    const version = process.env.REACT_APP_GIT_SHA || 'snapshot';
    const commonJSFilename = `commons.${version}.js`;

    if (process.env.NODE_ENV === 'production') {
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'commons',
                filename: commonJSFilename,
                minChunks: module => /node_modules/.test(module.resource)
            })
        );

        const domain = process.env.BUILD_DOMAIN ? process.env.BUILD_DOMAIN.split(',') : [];

        config.plugins.push(
            new JavaScriptObfuscator({ rotateUnicodeArray: true, domainLock: domain }, [commonJSFilename])
        );
    }

    return config;
};
