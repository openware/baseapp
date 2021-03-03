export const getStylesValueByKey = (variable: string): string => {
    const rootElement = document.documentElement;
    const lightModeBodyElement = document.querySelector<HTMLElement>('.light-mode')!;
    const computedStyles = window.getComputedStyle(document.body);


    if (variable) {
        const key = variable.slice(4, variable.length - 1);

        if (lightModeBodyElement?.style.getPropertyValue(key)) {
            return lightModeBodyElement.style.getPropertyValue(key);
        }

        if (rootElement?.style.getPropertyValue(key)) {
            return rootElement.style.getPropertyValue(key);
        }

        if (computedStyles?.getPropertyValue(key)) {
            return computedStyles.getPropertyValue(key);
        }
    }

    return '';
};
