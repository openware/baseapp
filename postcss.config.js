module.exports = {
    include: [
        'node_modules',
    ],
    plugins: [
        require('postcss-import'),
        require('postcss-nested'),
        require('postcss-autoreset')({
            reset: {
                color: 'var(--base)',
                'font-size': 'var(--font-size)',
                'font-family': 'var(--font-family)',
                'background-color': 'var(--background-dark)',
            },
        }),
        require('postcss-hexrgba'),
        require('autoprefixer'),
    ],
};
