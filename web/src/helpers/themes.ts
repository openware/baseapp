import {
    COLOR_VARIABLE_PRESETS,
    ThemeInterface,
    ThemePaletteInterface,
} from '../themes';

/*
1. Remove all color variables from root and body elements
*/
export const clearCustomizationSettings = () => {
    const rootElement = document.documentElement;
    const bodyElement = document.querySelector<HTMLElement>('body')!;

    if (rootElement) {    
        COLOR_VARIABLE_PRESETS.reduce((result, item) => {
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
export const applyThemePaletteColors = (
    palette?: ThemePaletteInterface,
    toggleChartRebuild?: () => void,
) => {
    const themeFromConfig: ThemeInterface | undefined =
        window.env?.theme ? JSON.parse(window.env.theme) : undefined;
    const rootElement = document.documentElement;
    const bodyElement = document.querySelector<HTMLElement>('body')!;
    let shouldChartRebuild = false;

    if (rootElement) {
        const paletteFromConfig = themeFromConfig?.palette;


        COLOR_VARIABLE_PRESETS.reduce((result, item) => {
            let darkModeColor = undefined;
            let lightModeColor = undefined;
    
            if (palette?.colors?.dark) {
                darkModeColor = palette.colors.dark.find((color => color.key === item.key));
            }

            if (!darkModeColor && paletteFromConfig?.colors?.dark) {
                darkModeColor = paletteFromConfig.colors.dark.find((color => color.key === item.key));
            }

            if (palette?.colors?.light) {
                lightModeColor = palette.colors.light.find((color => color.key === item.key));
            }

            if (!lightModeColor && paletteFromConfig?.colors?.light) {
                lightModeColor = paletteFromConfig.colors.light.find((color => color.key === item.key));
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
export const applyTheme = (
    theme?: ThemeInterface,
    toggleChartRebuild?: () => void,
) => {
    clearCustomizationSettings();
    applyThemePaletteColors(theme?.palette, toggleChartRebuild);
};
