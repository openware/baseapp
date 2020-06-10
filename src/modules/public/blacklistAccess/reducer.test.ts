import * as actions from './actions';
import { blacklistAccessReducer, initialBlacklistAccessState } from './reducer';

describe('blacklistCountryReducer', () => {
    it('should handle SEND_ACCESS_TOKEN_FETCH', () => {
        const expectedState = {
            ...initialBlacklistAccessState,
            platformLoading: true,
            error: false,
         };
        expect(blacklistAccessReducer(initialBlacklistAccessState, actions.sendAccessToken({ whitelink_token: '' }))).toEqual(expectedState);
    });

    it('should handle SEND_ACCESS_TOKEN_DATA', () => {
        const expectedState = {
            ...initialBlacklistAccessState,
            platformLoading: false,
         };
        expect(blacklistAccessReducer(initialBlacklistAccessState, actions.sendAccessTokenData())).toEqual(expectedState);
    });

    it('should handle SEND_ACCESS_TOKEN_ERROR', () => {
        const expectedState = {
            ...initialBlacklistAccessState,
            platformLoading: false,
            error: true,
        };
        expect(blacklistAccessReducer(initialBlacklistAccessState, actions.sendAccessTokenError())).toEqual(expectedState);
    });
});
