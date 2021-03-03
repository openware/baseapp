import * as actions from './actions';
import { changeColorThemeReducer, initialChangeColorThemeState } from './reducer';

describe('Change color theme reducer', () => {
    it('should handle CHANGE_COLOR_THEME', () => {
        let expectedState = {
            color: 'light',
            chartRebuild: false,
            sideBarActive: false,
            marketSelectorActive: false,
            isMobileDevice: false,
            applyWindowEnvsTrigger: false,
        };
        expect(changeColorThemeReducer(initialChangeColorThemeState, actions.changeColorTheme('light'))).toEqual(expectedState);
        expect(localStorage.getItem('colorTheme')).toEqual('light');
        expectedState = {
            color: 'dark',
            chartRebuild: false,
            sideBarActive: false,
            marketSelectorActive: false,
            isMobileDevice: false,
            applyWindowEnvsTrigger: false,
        };
        expect(changeColorThemeReducer(initialChangeColorThemeState, actions.changeColorTheme('dark'))).toEqual(expectedState);
        expect(localStorage.getItem('colorTheme')).toEqual('dark');
    });
});
