import * as actions from './actions';
import {
    API_KEYS_2FA_MODAL,
    API_KEYS_DATA,
    API_KEYS_FETCH,
    API_KEY_CREATE,
    API_KEY_CREATE_FETCH,
    API_KEY_DELETE,
    API_KEY_DELETE_FETCH,
    API_KEY_UPDATE,
    API_KEY_UPDATE_FETCH,
} from './constants';

describe('Api Keys actions', () => {
    it('should check apiKeysFetch action creator', () => {
        const payload = { pageIndex: 0, limit: 25 };
        const expectedAction = { type: API_KEYS_FETCH, payload };
        expect(actions.apiKeysFetch(payload)).toEqual(expectedAction);
    });

    it('should check apiKeysData action creator', () => {
        const payload = { apiKeys: [], pageIndex: 0, nextPageExists: false };
        const expectedAction = { type: API_KEYS_DATA, payload };
        expect(actions.apiKeysData(payload)).toEqual(expectedAction);
    });

    it('should check apiKeyCreateFetch action creator', () => {
        const payload = { totp_code: '123456', algorithm: 'HS256' };
        const expectedAction = { type: API_KEY_CREATE_FETCH, payload };
        expect(actions.apiKeyCreateFetch(payload)).toEqual(expectedAction);
    });

    it('should check apiKeyCreate action creator', () => {
        const payload = { kid: '1' } as actions.ApiKeyDataInterface;
        const expectedAction = { type: API_KEY_CREATE, payload };
        expect(actions.apiKeyCreate(payload)).toEqual(expectedAction);
    });

    it('should check apiKeyUpdateFetch action creator', () => {
        const payload = {
            apiKey: { kid: '1' } as actions.ApiKeyDataInterface,
            totp_code: '123456',
        };
        const expectedAction = { type: API_KEY_UPDATE_FETCH, payload };
        expect(actions.apiKeyUpdateFetch(payload)).toEqual(expectedAction);
    });

    it('should check apiKeyUpdate action creator', () => {
        const payload = { kid: '1' } as actions.ApiKeyDataInterface;
        const expectedAction = { type: API_KEY_UPDATE, payload };
        expect(actions.apiKeyUpdate(payload)).toEqual(expectedAction);
    });

    it('should check apiKeyDeleteFetch action creator', () => {
        const payload = { totp_code: '123456', kid: '1' };
        const expectedAction = { type: API_KEY_DELETE_FETCH, payload };
        expect(actions.apiKeyDeleteFetch(payload)).toEqual(expectedAction);
    });

    it('should check apiKeyDelete action creator', () => {
        const payload = { kid: '1' };
        const expectedAction = { type: API_KEY_DELETE, payload };
        expect(actions.apiKeyDelete(payload)).toEqual(expectedAction);
    });

    it('should check apiKeys2FAModal action creator', () => {
        const payload = { active: true };
        const expectedAction = { type: API_KEYS_2FA_MODAL, payload };
        expect(actions.apiKeys2FAModal(payload)).toEqual(expectedAction);
    });
});
