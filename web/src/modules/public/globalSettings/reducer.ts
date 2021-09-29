import {
    CHANGE_COLOR_THEME,
    TOGGLE_CHART_REBUILD,
    TOGGLE_MARKET_SELECTOR,
    TOGGLE_MOBILE_DEVICE,
    TOGGLE_ORDERS_PAIRS_SWITCHER,
    TOGGLE_SIDEBAR,
    TRIGGER_APPLY_WINDOW_ENVS,
} from './constants';

export interface GlobalSettingsState {
    color: string;
    chartRebuild: boolean;
    marketSelectorActive: boolean;
    isMobileDevice: boolean;
    sideBarActive: boolean;
    applyWindowEnvsTrigger: boolean;
    ordersHideOtherPairs: boolean;
}

const currentGlobalSettings: string = localStorage.getItem('colorTheme') || 'dark';

export const initialChangeGlobalSettingsState: GlobalSettingsState = {
    color: currentGlobalSettings,
    chartRebuild: false,
    marketSelectorActive: false,
    isMobileDevice: false,
    sideBarActive: false,
    applyWindowEnvsTrigger: false,
    ordersHideOtherPairs: true,
};

export const changeGlobalSettingsReducer = (state = initialChangeGlobalSettingsState, action) => {
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
        case TOGGLE_MARKET_SELECTOR:
            return {
                ...state,
                marketSelectorActive: !state.marketSelectorActive,
                sideBarActive: false,
            };
        case TOGGLE_MOBILE_DEVICE:
            return {
                ...state,
                isMobileDevice: action.payload,
            };
        case TOGGLE_SIDEBAR:
            return {
                ...state,
                sideBarActive: action.payload,
                marketSelectorActive: false,
            };
        case TRIGGER_APPLY_WINDOW_ENVS:
            return {
                ...state,
                applyWindowEnvsTrigger: !state.applyWindowEnvsTrigger,
            };
        case TOGGLE_ORDERS_PAIRS_SWITCHER:
            return {
                ...state,
                ordersHideOtherPairs: action.payload,
            };
        default:
            return state;
    }
};
