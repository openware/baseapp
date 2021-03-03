export const toggleColorTheme = (value: string) => {
    const rootElement = document.getElementsByTagName('body')[0];
    if (value === 'light') {
        rootElement && rootElement.classList.add('light-mode');
    } else {
        rootElement && rootElement.classList.remove('light-mode');
    }
};
