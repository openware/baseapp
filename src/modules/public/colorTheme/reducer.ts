import {
    CHANGE_COLOR_THEME,
    TOGGLE_CHART_REBUILD,
    TOGGLE_MARKET_SELECTOR,
    TOGGLE_SIDEBAR,
} from './constants';

export interface ColorThemeState {
    color: string;
    chartRebuild: boolean;
    sideBarActive: boolean;
    marketSelectorActive: boolean;
}

const currentColorTheme: string = localStorage.getItem('colorTheme') || 'basic';

export const initialChangeColorThemeState: ColorThemeState = {
    color: currentColorTheme,
    chartRebuild: false,
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
        case TOGGLE_CHART_REBUILD:
            return {
                ...state,
                chartRebuild: !state.chartRebuild,
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
