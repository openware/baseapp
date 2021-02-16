export interface ThemeColorInterface {
    key: string;
    value: string;
}

export interface CustomizationDataInterface {
    settings?: string;
}

export interface CustomizationCurrentDataInterface {
    theme_id: number;
    theme_colors: {
        [key: string]: ThemeColorInterface[];
    };
}
