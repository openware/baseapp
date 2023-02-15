/* Dark mode theme presets */
import { BasicTheme as BasicThemeDark } from './templates/dark/Basic';
import { BasicNewTheme as BasicNewThemeDark } from './templates/dark/BasicNew';
import { GreenTheme as GreenThemeDark } from './templates/dark/Green';
import { RedTheme as RedThemeDark } from './templates/dark/Red';
import { VioletTheme as VioletThemeDark } from './templates/dark/Violet';
import { YellowTheme as YellowThemeDark } from './templates/dark/Yellow';

/* Light mode theme presets */
import { BasicTheme as BasicThemeLight } from './templates/light/Basic';
import { BasicNewTheme as BasicNewThemeLight } from './templates/light/BasicNew';
import { GreenTheme as GreenThemeLight } from './templates/light/Green';
import { RedTheme as RedThemeLight } from './templates/light/Red';
import { VioletTheme as VioletThemeLight } from './templates/light/Violet';
import { YellowTheme as YellowThemeLight } from './templates/light/Yellow';

import { ThemePresetInterface } from './types';

export const AVAILABLE_THEME_PRESETS: ThemePresetInterface[] = [
    {
        theme_id: 0,
        title: 'page.body.customization.themes.theme.basic.title',
        theme_colors: {
            light: BasicThemeLight,
            dark: BasicThemeDark,
        },
    },
    {
        theme_id: 1,
        title: 'page.body.customization.themes.theme.basicNew.title',
        theme_colors: {
            light: BasicNewThemeLight,
            dark: BasicNewThemeDark,
        },
    },
    {
        theme_id: 2,
        title: 'page.body.customization.themes.theme.yellow.title',
        theme_colors: {
            light: YellowThemeLight,
            dark: YellowThemeDark,
        },
    },
    {
        theme_id: 3,
        title: 'page.body.customization.themes.theme.red.title',
        theme_colors: {
            light: RedThemeLight,
            dark: RedThemeDark,
        },
    },
    {
        theme_id: 4,
        title: 'page.body.customization.themes.theme.green.title',
        theme_colors: {
            light: GreenThemeLight,
            dark: GreenThemeDark,
        },
    },
    {
        theme_id: 5,
        title: 'page.body.customization.themes.theme.violet.title',
        theme_colors: {
            light: VioletThemeLight,
            dark: VioletThemeDark,
        },
    },
];
