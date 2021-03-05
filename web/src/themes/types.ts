export interface ThemePaletteColorInterface {
    key: string;
    value: string;
}

export interface ThemePaletteInterface {
    key: string;
    colors: {
        [key: string]: ThemePaletteColorInterface[];
    };
}

export interface ThemeLogoInterface {
    url: string;
    width?: string;
}

export interface ThemeFontInterface {
    key: string;
    url: string;
}
export interface ThemeInterface {
    palette?: ThemePaletteInterface;
    logo?: ThemeLogoInterface;
    font?: ThemeFontInterface;
}
