import {
    CHANGE_COLOR_THEME,
} from './constants';

export interface ChangeColorThemeAction {
    type: string;
    payload: string;
}
export const changeColorTheme = (payload: string): ChangeColorThemeAction => ({
    type: CHANGE_COLOR_THEME,
    payload,
});
