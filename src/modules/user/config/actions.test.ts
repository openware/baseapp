import { CommonError } from '../../types';
import * as actions from './actions';
import { CONFIG_UPDATE, CONFIG_UPDATE_DATA, CONFIG_UPDATE_ERROR } from './constants';
import { ConfigUpdateDataInterface } from './types';

describe('ConfigUpdate actions', () => {
    const fakeConfig: ConfigUpdateDataInterface = {
        scope: 'public',
        key: 'minutesUntilAutoLogout',
        value: '10',
        component: 'baseapp',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check ConfigUpdate action creator', () => {
        const payload = fakeConfig;
        const expectedAction = { type: CONFIG_UPDATE, payload };
        expect(actions.configUpdate(payload)).toEqual(expectedAction);
    });

    it('should check ConfigUpdateData action creator', () => {
        const payload = fakeConfig;
        const expectedAction = { type: CONFIG_UPDATE_DATA, payload };
        expect(actions.configUpdateData(payload)).toEqual(expectedAction);
    });

    it('should check ConfigUpdateError action creator', () => {
        const expectedAction = { type: CONFIG_UPDATE_ERROR, error: error };
        expect(actions.configUpdateError(error)).toEqual(expectedAction);
    });
});
