module.exports = {
    include: [
        'node_modules',
    ],
    plugins: [
        require('postcss-import'),
        require('postcss-nested'),
        require('postcss-hexrgba'),
        require('autoprefixer'),
    ],
};
