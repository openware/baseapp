import { ThemeColorInterface } from '../modules';
import {
    BlueTheme as BlueThemeDark,
    RedTheme as RedThemeDark,
    GreenTheme as GreenThemeDark,
    PurpleTheme as PurpleThemeDark,
} from './templates/dark';
import {
    BlueTheme as BlueThemeLight,
    RedTheme as RedThemeLight,
} from './templates/light';

export * from './ColorTitles';

export interface ThemeInterface {
    id: number;
    title: string;
    themes: {
        [key: string]: ThemeColorInterface[];
    };
}

export const AVAILABLE_COLOR_THEMES: ThemeInterface[] = [
    {
        id: 0,
        title: 'page.body.customization.themes.theme.darkBlue.title',
        themes: {
            light: BlueThemeLight,
            dark: BlueThemeDark,
        },
    },
    {
        id: 1,
        title: 'page.body.customization.themes.theme.darkRed.title',
        themes: {
            light: RedThemeLight,
            dark: RedThemeDark,
        },
    },
    {
        id: 2,
        title: 'page.body.customization.themes.theme.purple.title',
        themes: {
            light: BlueThemeLight,
            dark: PurpleThemeDark,
        },
    },
    {
        id: 3,
        title: 'page.body.customization.themes.theme.green.title',
        themes: {
            light: BlueThemeLight,
            dark: GreenThemeDark,
        },
    },
];
