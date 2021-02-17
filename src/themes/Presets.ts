/* Dark mode theme presets */
import { BlueTheme as BlueThemeDark } from './templates/dark/Blue';
import { RedTheme as RedThemeDark } from './templates/dark/Red';
import { GreenTheme as GreenThemeDark } from './templates/dark/Green';
import { PurpleTheme as PurpleThemeDark } from './templates/dark/Purple';

/* Light mode theme presets */
import { BlueTheme as BlueThemeLight } from './templates/light/Blue';
import { RedTheme as RedThemeLight } from './templates/light/Red';

import { ThemePresetInterface } from './types';

export const AVAILABLE_THEME_PRESETS: ThemePresetInterface[] = [
    {
        theme_id: 0,
        title: 'page.body.customization.themes.theme.darkBlue.title',
        theme_colors: {
            light: BlueThemeLight,
            dark: BlueThemeDark,
        },
    },
    {
        theme_id: 1,
        title: 'page.body.customization.themes.theme.darkRed.title',
        theme_colors: {
            light: RedThemeLight,
            dark: RedThemeDark,
        },
    },
    {
        theme_id: 2,
        title: 'page.body.customization.themes.theme.purple.title',
        theme_colors: {
            light: BlueThemeLight,
            dark: PurpleThemeDark,
        },
    },
    {
        theme_id: 3,
        title: 'page.body.customization.themes.theme.green.title',
        theme_colors: {
            light: BlueThemeLight,
            dark: GreenThemeDark,
        },
    },
];
