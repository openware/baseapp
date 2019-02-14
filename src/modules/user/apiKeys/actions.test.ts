import * as actions from './actions';
import { API_KEYS_FETCH } from './constants';

describe('Api Keys actions', () => {
    it('should check apiKeysFetch action', () => {
        const payload = {totp_code: '123456'};
        const expectedAction = {type: API_KEYS_FETCH, payload};
        expect(actions.apiKeysFetch(payload)).toEqual(expectedAction);
    });
});
