import { CommonError } from '../../types';
import * as actions from './actions';
import {
    SEND_BLOCKLIST_ACCESS_TOKEN_DATA,
    SEND_BLOCKLIST_ACCESS_TOKEN_ERROR,
    SEND_BLOCKLIST_ACCESS_TOKEN_FETCH,
    SET_BLOCKLIST_STATUS,
} from './constants';

describe('Blacklist country actions', () => {
    const error: CommonError = {
        message: ['Server error'],
        code: 500,
    };

    it('should check sendAccessToken action creator', () => {
        const expectedAction = { type: SEND_BLOCKLIST_ACCESS_TOKEN_FETCH, payload: { whitelink_token: '' } };
        expect(actions.sendAccessToken({ whitelink_token: '' })).toEqual(expectedAction);
    });

    it('should check sendAccessTokenData action creator', () => {
        const expectedAction = {
            type: SEND_BLOCKLIST_ACCESS_TOKEN_DATA,
        };
        expect(actions.sendAccessTokenData()).toEqual(expectedAction);
    });

    it('should check sendAccessTokenError action creator', () => {
        const expectedAction = { type: SEND_BLOCKLIST_ACCESS_TOKEN_ERROR, error };
        expect(actions.sendAccessTokenError(error)).toEqual(expectedAction);
    });

    it('should check setBlocklistStatus action creator', () => {
        const payload = { status: '' };
        const expectedAction = { type: SET_BLOCKLIST_STATUS, payload };
        expect(actions.setBlocklistStatus(payload)).toEqual(expectedAction);
    });
});
