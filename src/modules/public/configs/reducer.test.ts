import * as actions from './actions';
import { initialConfigsState, configsReducer } from './reducer';
import { Configs } from './types';

describe('configsReducer', () => {
    const fakeConfigs: Configs = {
        captcha_type: 'none',
    };

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle CONFIGS_FETCH', () => {
        const expectedState = {
            ...initialConfigsState,
            loading: true,
         };
        expect(configsReducer(initialConfigsState, actions.configsFetch())).toEqual(expectedState);
    });

    it('should handle CONFIGS_DATA', () => {
        const expectedState = {
            ...initialConfigsState,
            loading: false,
            success: true,
            data: fakeConfigs,
        };

        const payload = fakeConfigs;
        expect(configsReducer(initialConfigsState, actions.configsData(payload))).toEqual(expectedState);
    });

    it('should handle CONFIGS_ERROR', () => {
        const expectedState = {
            ...initialConfigsState,
            loading: false,
            success: false,
            error: error,
         };
        expect(configsReducer(initialConfigsState, actions.configsError(error))).toEqual(expectedState);
    });
});
