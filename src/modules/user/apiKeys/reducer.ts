import update from 'immutability-helper';
import {
    ApiKeyCreateData,
    ApiKeyCreateFetch,
    ApiKeyDataInterface,
    ApiKeyDelete,
    ApiKeyDeleteFetch,
    ApiKeys2FAModal,
    ApiKeysData,
    ApiKeysFetch, ApiKeyUpdate, ApiKeyUpdateFetch,
} from './actions';
import {
    API_KEY_CREATE, API_KEY_DELETE, API_KEY_UPDATE,
    API_KEYS_2FA_MODAL,
    API_KEYS_DATA,
} from './constants';

export interface ApiKeyStateModal {
    active: boolean;
    action?: 'getKeys' | 'createKey' | 'createSuccess' | 'updateKey' | 'deleteKey';
    apiKey?: ApiKeyDataInterface;
}

export interface ApiKeysState {
    apiKeys: ApiKeyDataInterface[];
    dataLoaded: boolean;
    modal: ApiKeyStateModal;
}

export const initialApiKeysState: ApiKeysState = {
    apiKeys: [],
    dataLoaded: false,
    modal: {
        active: false,
    },
};

export type ApiKeysAction = ApiKeysFetch |
    ApiKeysData |
    ApiKeyCreateFetch |
    ApiKeyCreateData |
    ApiKeyUpdateFetch |
    ApiKeyUpdate |
    ApiKeyDeleteFetch |
    ApiKeyDelete |
    ApiKeys2FAModal;

export const apiKeysReducer = (state = initialApiKeysState, action: ApiKeysAction): ApiKeysState => {
    switch (action.type) {
        case API_KEYS_DATA:
            return {
                ...state,
                apiKeys: action.payload,
                dataLoaded: true,
            };
        case API_KEY_CREATE:
            return {
                ...state,
                apiKeys: state.apiKeys.concat(action.payload),
            };
        case API_KEY_UPDATE:
            const apiKeyIndex = state.apiKeys.findIndex(e => e.kid === action.payload.kid);
            const apiKeys = update(state.apiKeys, {
                [apiKeyIndex]: {
                    state: {$set: action.payload.state},
                    updated_at: {$set: action.payload.updated_at},
                },
            });

            return {
                ...state,
                apiKeys,
            };
        case API_KEY_DELETE:
            return {
                ...state,
                apiKeys: state.apiKeys.filter(apiKey => apiKey.kid !== action.payload.kid),
            };
        case API_KEYS_2FA_MODAL:
            return {
                ...state,
                modal: action.payload,
            };
        default:
            return state;
    }
};
