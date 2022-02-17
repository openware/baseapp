const customTailwindColors = {
    colors: {
        'primary-cta-color-main': '#3c78e9',
        'primary-cta-color-hover': '#3c78e9',
        'dropdown-background-color': '#FFFFFF',
        'main-background-color': '#FFFFFF',
    },
    textColor: {
        'color-contrast': '#FFFFFF',
        'cta-contrast': '#090909',
        'secondary-color': '#737373',
    },
    boxShadow: {
        'lg-updated': '0px 0px 2px rgba(0, 0, 0, 0.12), 0px 10px 15px -3px rgba(0, 0, 0, 0.12), 0px 4px 6px -2px rgba(0, 0, 0, 0.04)',
    },
    borderColor: {
        'divider-color-20': '1px solid #DCDCDC',
    }
}

module.exports = {
    // we need it for prod
    purge: ['./src/**/**/*.{js,jsx,ts,tsx}', './node_modules/@openware/react-opendax/**/*.js'],
    darkMode: false, // or 'media' or 'class'
    important: true,
    theme: {
        extend: {
            ...customTailwindColors,
        },
    },
    variants: {},
    plugins: [],
}
