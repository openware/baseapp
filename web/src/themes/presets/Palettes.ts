/* Dark mode theme presets */
import { BasicNewTheme as BasicNewThemeDark } from './palettes/dark/BasicNew';
import { BasicTheme as BasicThemeDark } from './palettes/dark/Basic';
import { GreenTheme as GreenThemeDark } from './palettes/dark/Green';
import { RedTheme as RedThemeDark } from './palettes/dark/Red';
import { VioletTheme as VioletThemeDark } from './palettes/dark/Violet';
import { YellowTheme as YellowThemeDark } from './palettes/dark/Yellow';

/* Light mode theme presets */
import { BasicNewTheme as BasicNewThemeLight } from './palettes/light/BasicNew';
import { BasicTheme as BasicThemeLight } from './palettes/light/Basic';
import { GreenTheme as GreenThemeLight } from './palettes/light/Green';
import { RedTheme as RedThemeLight } from './palettes/light/Red';
import { VioletTheme as VioletThemeLight } from './palettes/light/Violet';
import { YellowTheme as YellowThemeLight } from './palettes/light/Yellow';

import { ThemePaletteColorInterface } from '../types';

export interface PalettePresetInterface {
    key: string;
    title: string;
    colors: {
        [key: string]: ThemePaletteColorInterface[];
    }
}

export const PALETTE_PRESETS: PalettePresetInterface[] = [
    {
        key: 'basic',
        title: 'page.body.customization.themes.theme.basic.title',
        colors: {
            light: BasicThemeLight,
            dark: BasicThemeDark,
        },
    },
    {
        key: 'basic-new',
        title: 'page.body.customization.themes.theme.basicNew.title',
        colors: {
            light: BasicNewThemeLight,
            dark: BasicNewThemeDark,
        },
    },
    {
        key: 'yellow',
        title: 'page.body.customization.themes.theme.yellow.title',
        colors: {
            light: YellowThemeLight,
            dark: YellowThemeDark,
        },
    },
    {
        key: 'red',
        title: 'page.body.customization.themes.theme.red.title',
        colors: {
            light: RedThemeLight,
            dark: RedThemeDark,
        },
    },
    {
        key: 'green',
        title: 'page.body.customization.themes.theme.green.title',
        colors: {
            light: GreenThemeLight,
            dark: GreenThemeDark,
        },
    },
    {
        key: 'violet',
        title: 'page.body.customization.themes.theme.violet.title',
        colors: {
            light: VioletThemeLight,
            dark: VioletThemeDark,
        },
    },
];
