import {
    API_KEY_CREATE,
    API_KEY_CREATE_FETCH,
    API_KEY_DELETE,
    API_KEY_DELETE_FETCH, API_KEY_UPDATE, API_KEY_UPDATE_FETCH,
    API_KEYS_2FA_MODAL,
    API_KEYS_DATA,
    API_KEYS_FETCH,
} from './constants';
import { ApiKeysState } from './reducer';

const API_KEY_ALGORITHM = 'HS256';

export interface ApiKeyDataInterface {
    algorithm: string;
    created_at: string;
    kid: string;
    scope?: typeof Array;
    secret?: SecretInterface;
    state: string;
    updated_at: string;
}

export interface SecretInterface {
   data: {
       value: string;
   };
}

export interface ApiKeysFetch {
    type: typeof API_KEYS_FETCH;
}

export interface ApiKeysData {
    type: typeof API_KEYS_DATA;
    payload: ApiKeyDataInterface[];
}

export interface ApiKeyCreateFetch {
    type: typeof API_KEY_CREATE_FETCH;
    payload: {
        totp_code: string,
        algorithm?: string,
    };
}

export interface ApiKeyCreateData {
    type: typeof API_KEY_CREATE;
    payload: ApiKeyDataInterface;
}

export interface ApiKeyUpdateFetch {
    type: typeof API_KEY_UPDATE_FETCH;
    payload: {
        apiKey: ApiKeyDataInterface;
        totp_code: string,
    };
}

export interface ApiKeyUpdate {
    type: typeof API_KEY_UPDATE;
    payload: ApiKeyDataInterface;
}

export interface ApiKeyDeleteFetch {
    type: typeof API_KEY_DELETE_FETCH;
    payload: {
        totp_code: string,
        kid: string,
    };
}

export interface ApiKeyDelete {
    type: typeof API_KEY_DELETE;
    payload: {
        kid: string;
    };
}

export interface ApiKeys2FAModal {
    type: typeof API_KEYS_2FA_MODAL;
    payload: ApiKeysState['modal'];
}

export const apiKeysFetch = (): ApiKeysFetch => ({
    type: API_KEYS_FETCH,
});

export const apiKeysData = (payload: ApiKeysData['payload']): ApiKeysData => ({
    type: API_KEYS_DATA,
    payload,
});

export const apiKeyCreateFetch = (payload: ApiKeyCreateFetch['payload']): ApiKeyCreateFetch => ({
    type: API_KEY_CREATE_FETCH,
    payload: {
        ...payload,
        algorithm: API_KEY_ALGORITHM,
    },
});

export const apiKeyCreate = (payload: ApiKeyCreateData['payload']): ApiKeyCreateData => ({
    type: API_KEY_CREATE,
    payload,
});

export const apiKeyUpdateFetch = (payload: ApiKeyUpdateFetch['payload']): ApiKeyUpdateFetch => ({
    type: API_KEY_UPDATE_FETCH,
    payload,
});

export const apiKeyUpdate = (payload: ApiKeyUpdate['payload']): ApiKeyUpdate => ({
    type: API_KEY_UPDATE,
    payload,
});

export const apiKeyDeleteFetch = (payload: ApiKeyDeleteFetch['payload']): ApiKeyDeleteFetch => ({
    type: API_KEY_DELETE_FETCH,
    payload,
});

export const apiKeyDelete = (payload: ApiKeyDelete['payload']): ApiKeyDelete => ({
    type: API_KEY_DELETE,
    payload,
});

export const apiKeys2FAModal = (payload: ApiKeys2FAModal['payload']): ApiKeys2FAModal => ({
    type: API_KEYS_2FA_MODAL,
    payload,
});
