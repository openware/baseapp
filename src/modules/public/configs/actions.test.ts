import { CommonError } from '../../types';
import * as actions from './actions';
import { CONFIGS_DATA, CONFIGS_ERROR, CONFIGS_FETCH } from './constants';
import { Configs } from './types';

describe('Configs actions', () => {
    const fakeConfigs: Configs = {
        captcha_type: 'none',
        password_min_entropy: 0,
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check ConfigsFetch action creator', () => {
        const expectedAction = { type: CONFIGS_FETCH };
        expect(actions.configsFetch()).toEqual(expectedAction);
    });

    it('should check ConfigsData action creator', () => {
        const payload = fakeConfigs;
        const expectedAction = { type: CONFIGS_DATA, payload };
        expect(actions.configsData(payload)).toEqual(expectedAction);
    });

    it('should check ConfigsError action creator', () => {
        const expectedAction = { type: CONFIGS_ERROR, error: error };
        expect(actions.configsError(error)).toEqual(expectedAction);
    });
});
