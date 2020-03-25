import {
    CHANGE_COLOR_THEME,
    TOGGLE_MARKET_SELECTOR,
    TOGGLE_SIDEBAR,
} from './constants';

export interface ColorThemeState {
    color: string;
    sideBarActive: boolean;
    marketSelectorActive: boolean;
}

const currentColorTheme: string = localStorage.getItem('colorTheme') || 'basic';

export const initialChangeColorThemeState: ColorThemeState = {
    color: currentColorTheme,
    sideBarActive: false,
    marketSelectorActive: false,
};

export const changeColorThemeReducer = (state = initialChangeColorThemeState, action) => {
    switch (action.type) {
        case CHANGE_COLOR_THEME:
            localStorage.setItem('colorTheme', action.payload);

            return {
                ...state,
                color: action.payload,
             };
        case TOGGLE_SIDEBAR:
            return {
                ...state,
                sideBarActive: action.payload,
                marketSelectorActive: false,
            };
        case TOGGLE_MARKET_SELECTOR:
            return {
                ...state,
                marketSelectorActive: !state.marketSelectorActive,
                sideBarActive: false,
            };
        default:
            return state;
    }
};
