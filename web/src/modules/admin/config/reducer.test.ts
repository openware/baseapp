import { CommonError } from '../../types';
import * as actions from './actions';
import { configUpdateReducer, initialConfigUpdateState } from './reducer';
import { ConfigUpdateDataInterface } from './types';

describe('configReducer', () => {
    const fakeConfig: ConfigUpdateDataInterface = {
        scope: 'public',
        key: 'minutesUntilAutoLogout',
        value: '10',
        component: 'global',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle CONFIG_UPDATE', () => {
        const expectedState = {
            ...initialConfigUpdateState,
            loading: true,
        };

        const payload = fakeConfig;
        expect(configUpdateReducer(initialConfigUpdateState, actions.configUpdate(payload))).toEqual(expectedState);
    });

    it('should handle CONFIG_UPDATE_DATA', () => {
        const expectedState = {
            ...initialConfigUpdateState,
            loading: false,
            success: true,
            data: fakeConfig,
        };

        const payload = fakeConfig;
        expect(configUpdateReducer(initialConfigUpdateState, actions.configUpdateData(payload))).toEqual(expectedState);
    });

    it('should handle CONFIG_UPDATE_ERROR', () => {
        const expectedState = {
            ...initialConfigUpdateState,
            loading: false,
            success: false,
            error: error,
        };
        expect(configUpdateReducer(initialConfigUpdateState, actions.configUpdateError(error))).toEqual(expectedState);
    });
});
