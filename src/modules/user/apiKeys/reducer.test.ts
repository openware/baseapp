import * as actions from './actions';
import { apiKeysReducer, initialApiKeysState } from './reducer';

describe('Api Keys reducers', () => {
    it('should handle API_KEYS_DATA', () => {
        const payload: actions.ApiKeysData['payload'] = [{kid: 'a'}] as actions.ApiKeyDataInterface[];
        const expectedState = {...initialApiKeysState, apiKeys: payload};
        expect(apiKeysReducer(initialApiKeysState, actions.apiKeysData(payload)).apiKeys).toEqual(expectedState.apiKeys);
    });
});
