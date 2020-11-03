import { DarkBlueTheme, DarkRedTheme, GreenTheme, PurpleTheme, ThemeColorInterface } from './templates';

export * from './templates';
export * from './ColorTitles';

export interface ThemeInterface {
    id: number;
    title: string;
    theme: ThemeColorInterface[];
}

export const AVAILABLE_COLOR_THEMES: ThemeInterface[] = [
    { id: 0, title: 'page.body.customization.themes.theme.darkBlue.title', theme: DarkBlueTheme },
    { id: 1, title: 'page.body.customization.themes.theme.darkRed.title', theme: DarkRedTheme },
    { id: 2, title: 'page.body.customization.themes.theme.purple.title', theme: PurpleTheme },
    { id: 3, title: 'page.body.customization.themes.theme.green.title', theme: GreenTheme },
];
