import {
    CHANGE_COLOR_THEME,
    TOGGLE_CHART_REBUILD,
    TOGGLE_MARKET_SELECTOR,
    TOGGLE_MOBILE_DEVICE,
    TOGGLE_SIDEBAR,
} from './constants';

export interface ChangeColorThemeAction {
    type: string;
    payload: string;
}

export interface ToggleChartRebuildAction {
    type: string;
}

export interface ToggleMarketSelectorAction {
    type: string;
}

export interface ToggleMobileDeviceAction {
    type: string;
    payload: boolean;
}

export interface ToggleSidebarAction {
    type: string;
    payload: boolean;
}

export type UIActions =
    | ChangeColorThemeAction
    | ToggleChartRebuildAction
    | ToggleMarketSelectorAction
    | ToggleMobileDeviceAction
    | ToggleSidebarAction;

export const toggleChartRebuild = (): ToggleChartRebuildAction => ({
    type: TOGGLE_CHART_REBUILD,
});

export const changeColorTheme = (payload: string): ChangeColorThemeAction => ({
    type: CHANGE_COLOR_THEME,
    payload,
});

export const toggleMarketSelector = (): ToggleMarketSelectorAction => ({
    type: TOGGLE_MARKET_SELECTOR,
});

export const setMobileDevice = (payload: boolean): ToggleMobileDeviceAction => ({
    type: TOGGLE_MOBILE_DEVICE,
    payload,
});

export const toggleSidebar = (payload: boolean): ToggleSidebarAction => ({
    type: TOGGLE_SIDEBAR,
    payload,
});
