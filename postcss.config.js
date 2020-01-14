module.exports = {
    include: [
        'node_modules',
    ],
    plugins: [
        require('postcss-import'),
        require('postcss-nested'),
        require('postcss-autoreset')({
            reset: {
                color: 'var(--primary-text-color)',
                'font-size': 'var(--font-size)',
                'font-family': 'var(--font-family)',
                'background-color': 'var(--body-background-color)',
            },
        }),
        require('postcss-hexrgba'),
        require('autoprefixer'),
    ],
};
