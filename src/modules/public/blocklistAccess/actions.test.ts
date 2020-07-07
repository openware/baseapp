import * as actions from './actions';
import {
    SEND_BLOCKLIST_ACCESS_TOKEN_DATA,
    SEND_BLOCKLIST_ACCESS_TOKEN_ERROR,
    SEND_BLOCKLIST_ACCESS_TOKEN_FETCH,
} from './constants';

describe('Blacklist country actions', () => {
    it('should check sendAccessToken action creator', () => {
        const expectedAction = { type: SEND_BLOCKLIST_ACCESS_TOKEN_FETCH, payload: { allowlink_token: '' }};
        expect(actions.sendAccessToken({ allowlink_token: '' })).toEqual(expectedAction);
    });

    it('should check sendAccessTokenData action creator', () => {
        const expectedAction = {
            type: SEND_BLOCKLIST_ACCESS_TOKEN_DATA,
        };
        expect(actions.sendAccessTokenData()).toEqual(expectedAction);
    });

    it('should check sendAccessTokenError action creator', () => {
        const expectedAction = { type: SEND_BLOCKLIST_ACCESS_TOKEN_ERROR };
        expect(actions.sendAccessTokenError()).toEqual(expectedAction);
    });
});
