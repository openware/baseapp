const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack = require('webpack');

module.exports = function override(config, env) {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push(new webpack.DefinePlugin({ 'process.env.BUILD_EXPIRE': JSON.stringify(process.env.BUILD_EXPIRE) }));
    const buildVersion = process.env.REACT_APP_BUILD_VERSION ? process.env.REACT_APP_BUILD_VERSION : 'Lite'
    const tenkoPublicKey = process.env.REACT_APP_TENKO_PUBLIC_KEY;
    const version = process.env.REACT_APP_GIT_SHA || 'snapshot';
    const commonJSFilename = `commons.${version}.js`;

    if (buildVersion == 'Lite') {
        if (!tenkoPublicKey) {
            throw new Error('REACT_APP_TENKO_PUBLIC_KEY must be set to build Lite version');
        }
        console.log(`LICENSE SERVER KEY:\n${(new Buffer(tenkoPublicKey, 'base64')).toString('ascii')}`);
    }

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
