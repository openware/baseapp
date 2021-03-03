export interface ThemeColorInterface {
    key: string;
    value: string;
}

export interface ThemePresetInterface extends CustomizationSettingsInterface {
    title: string;
}

export interface LogoInterface {
    url: string;
    width?: string;
}

export interface CustomizationSettingsInterface {
    theme_id: number;
    theme_colors: {
        [key: string]: ThemeColorInterface[];
    };
    header_logo?: LogoInterface;
}
