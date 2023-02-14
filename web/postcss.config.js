const tailwindcss = require('tailwindcss');

module.exports = {
    plugins: [tailwindcss, require('autoprefixer'), require('postcss-nested')],
};
