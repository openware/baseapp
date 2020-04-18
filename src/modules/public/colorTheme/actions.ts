import {
    CHANGE_COLOR_THEME,
    TOGGLE_CHART_REBUILD,
    TOGGLE_MARKET_SELECTOR,
    TOGGLE_SIDEBAR,
} from './constants';

export interface ChangeColorThemeAction {
    type: string;
    payload: string;
}

export interface ToggleChartRebuildAction {
    type: string;
}

export interface ToggleSidebarAction {
    type: string;
    payload: boolean;
}

export interface ToggleMarketSelectorAction {
    type: string;
}

export type UIActions =
    | ChangeColorThemeAction
    | ToggleChartRebuildAction
    | ToggleSidebarAction
    | ToggleMarketSelectorAction;

export const changeColorTheme = (payload: string): ChangeColorThemeAction => ({
    type: CHANGE_COLOR_THEME,
    payload,
});

export const toggleChartRebuild = (): ToggleChartRebuildAction => ({
    type: TOGGLE_CHART_REBUILD,
});

export const toggleSidebar = (payload: boolean): ToggleSidebarAction => ({
    type: TOGGLE_SIDEBAR,
    payload,
});

export const toggleMarketSelector = (): ToggleMarketSelectorAction => ({
    type: TOGGLE_MARKET_SELECTOR,
});
