import {
    CHANGE_COLOR_THEME,
    TOGGLE_MARKET_SELECTOR,
    TOGGLE_SIDEBAR,
} from './constants';

export interface ChangeColorThemeAction {
    type: string;
    payload: string;
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
    | ToggleSidebarAction
    | ToggleMarketSelectorAction;

export const changeColorTheme = (payload: string): ChangeColorThemeAction => ({
    type: CHANGE_COLOR_THEME,
    payload,
});

export const toggleSidebar = (payload: boolean): ToggleSidebarAction => ({
    type: TOGGLE_SIDEBAR,
    payload,
});

export const toggleMarketSelector = (): ToggleMarketSelectorAction => ({
    type: TOGGLE_MARKET_SELECTOR,
});
