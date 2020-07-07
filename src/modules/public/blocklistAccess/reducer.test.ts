import * as actions from './actions';
import { blocklistAccessReducer, initialBlocklistAccessState } from './reducer';

describe('blacklistCountryReducer', () => {
    it('should handle SEND_BLOCKLIST_ACCESS_TOKEN_FETCH', () => {
        const expectedState = {
            ...initialBlocklistAccessState,
            platformLoading: true,
            error: false,
         };
        expect(blocklistAccessReducer(initialBlocklistAccessState, actions.sendAccessToken({ allowlink_token: '' }))).toEqual(expectedState);
    });

    it('should handle SEND_BLOCKLIST_ACCESS_TOKEN_DATA', () => {
        const expectedState = {
            ...initialBlocklistAccessState,
            platformLoading: false,
         };
        expect(blocklistAccessReducer(initialBlocklistAccessState, actions.sendAccessTokenData())).toEqual(expectedState);
    });

    it('should handle SEND_BLOCKLIST_ACCESS_TOKEN_ERROR', () => {
        const expectedState = {
            ...initialBlocklistAccessState,
            platformLoading: false,
            error: true,
        };
        expect(blocklistAccessReducer(initialBlocklistAccessState, actions.sendAccessTokenError())).toEqual(expectedState);
    });
});
