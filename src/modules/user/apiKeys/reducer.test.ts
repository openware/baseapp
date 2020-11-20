import * as actions from './actions';
import { apiKeysReducer, initialApiKeysState } from './reducer';

describe('Api Keys reducers', () => {
    it('should handle API_KEYS_DATA', () => {
        const payload = { apiKeys: [], pageIndex: 0, nextPageExists: false };
        const expectedState = { ...initialApiKeysState, ...payload, dataLoaded: true };
        expect(apiKeysReducer(initialApiKeysState, actions.apiKeysData(payload))).toEqual(expectedState);
    });

    it('should handle API_KEY_CREATE', () => {
        const payload: actions.ApiKeyCreateData['payload'] = {kid: '1'} as actions.ApiKeyDataInterface;
        const expectedState = {...initialApiKeysState, apiKeys: [payload]};
        expect(apiKeysReducer(initialApiKeysState, actions.apiKeyCreate(payload)).apiKeys).toEqual(expectedState.apiKeys);
    });

    it('should handle API_KEY_UPDATE', () => {
        const payload: actions.ApiKeyUpdate['payload'] = {kid: '1', state: 'active', updated_at: '28-05-2019 13:52:18'} as actions.ApiKeyDataInterface;
        const expectedState = {...initialApiKeysState, apiKeys: [payload]};
        expect(apiKeysReducer({
            ...initialApiKeysState,
            apiKeys: [{kid: '1', state: 'disabled', updated_at: '28-05-2019 13:52:10'}] as actions.ApiKeyDataInterface[],
        }, actions.apiKeyUpdate(payload)).apiKeys).toEqual(expectedState.apiKeys);
    });

    it('should handle API_KEY_DELETE', () => {
        const payload: actions.ApiKeyDelete['payload'] = {kid: '1'};
        const expectedState = {...initialApiKeysState, apiKeys: []};
        expect(apiKeysReducer({
            ...initialApiKeysState,
            apiKeys: [{kid: '1', state: 'active'}] as actions.ApiKeyDataInterface[],
        }, actions.apiKeyDelete(payload)).apiKeys).toEqual(expectedState.apiKeys);
    });

    it('should handle API_KEYS_2FA_MODAL', () => {
        const payload: actions.ApiKeys2FAModal['payload'] = {active: false};
        const expectedState = {...initialApiKeysState, modal: {active: false}};
        expect(apiKeysReducer({
            ...initialApiKeysState,
            modal: {active: true},
        }, actions.apiKeys2FAModal(payload)).modal).toEqual(expectedState.modal);
    });
});
