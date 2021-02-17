import {
    AVAILABLE_COLOR_TITLES,
    CustomizationSettingsInterface,
} from '../themes';

/*
1. Remove all color variables from root and body elements
*/
export const clearCustomizationSettings = () => {
    const rootElement = document.documentElement;
    const bodyElement = document.querySelector<HTMLElement>('body')!;

    if (rootElement) {    
        AVAILABLE_COLOR_TITLES.reduce((result, item) => {
            rootElement.style.removeProperty(item.key);

            if (bodyElement) {
                bodyElement.style.removeProperty(item.key);
            }

            return result;
        }, {});
    }
}

/*
1. Set color style variables of root and body elements
2. Rebuild trading view chart to apply updated colors
*/
export const applyCustomizationSettingsColors = (
    customization?: CustomizationSettingsInterface,
    toggleChartRebuild?: () => void,
) => {
    const settingsFromConfig: CustomizationSettingsInterface | null | undefined =
        window.env?.settings ? JSON.parse(window.env.settings) : null;
    const rootElement = document.documentElement;
    const bodyElement = document.querySelector<HTMLElement>('body')!;
    let shouldChartRebuild = false;

    if (rootElement) {
        AVAILABLE_COLOR_TITLES.reduce((result, item) => {
            let darkModeColor = undefined;
            let lightModeColor = undefined;
    
            if (customization?.theme_colors?.dark) {
                darkModeColor = customization.theme_colors.dark.find((color => color.key === item.key));
            }

            if (!darkModeColor && settingsFromConfig?.theme_colors?.dark) {
                darkModeColor = settingsFromConfig.theme_colors.dark.find((color => color.key === item.key));
            }

            if (customization?.theme_colors?.light) {
                lightModeColor = customization.theme_colors.light.find((color => color.key === item.key));
            }

            if (!lightModeColor && settingsFromConfig?.theme_colors?.light) {
                lightModeColor = settingsFromConfig.theme_colors.light.find((color => color.key === item.key));
            }

            if (rootElement && darkModeColor) {
                rootElement.style.setProperty(item.key, darkModeColor.value);
                shouldChartRebuild = true;
            }

            if (bodyElement && lightModeColor) {
                bodyElement.style.setProperty(item.key, lightModeColor.value);
                shouldChartRebuild = true;
            }

            return result;
        }, {});
    }

    if (shouldChartRebuild) {
        toggleChartRebuild && toggleChartRebuild();
    }
};

/*
1. Remove all color variables from root and body elements
2. Set color style variables of root and body elements and rebuild chart
*/
export const applyCustomizationSettings = (
    customization?: CustomizationSettingsInterface | null,
    toggleChartRebuild?: () => void,
) => {
    clearCustomizationSettings();
    applyCustomizationSettingsColors(customization, toggleChartRebuild);
};
