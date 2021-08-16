module.exports = {
    // we need it for prod
    // purge: ["./src/**/**/*.{js,jsx,ts,tsx}"],
    darkMode: false, // or 'media' or 'class'
    important: true,
    theme: {
        extend: {
            colors: {
                "primary-cta-color-main": "#FF9110",
                "primary-cta-color-hover": "#FCD000",
                "dropdown-background-color": "#FFFFFF",
                "main-background-color": "#FFFFFF",
            },
            textColor: {
                "color-contrast": "#FFFFFF",
                "cta-contrast": "#090909",
                "secondary-color": "#737373",
            },
            borderColor: {
                "divider-color-20": "1px solid #DCDCDC",
            }
        },
    },
    variants: {},
    plugins: [],
}
