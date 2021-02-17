export const getStylesValueByKey = (variable: string): string => {
    const bodyStyles = window.getComputedStyle(document.body);

    if (bodyStyles && variable) {
        const key = variable.slice(4, variable.length - 1);

        return bodyStyles.getPropertyValue(key);
    }

    return '';
};
