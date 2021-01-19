import update from 'immutability-helper';
import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { CommonError } from '../../types';
import { ApiKeyDataInterface, ApiKeysAction } from './actions';
import {
    API_KEY_CREATE,
    API_KEY_DELETE,
    API_KEY_UPDATE,
    API_KEYS_2FA_MODAL,
    API_KEYS_DATA,
    API_KEYS_ERROR,
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
    pageIndex: number;
    nextPageExists: boolean;
    error?: CommonError;
}

export const initialApiKeysState: ApiKeysState = {
    apiKeys: [],
    dataLoaded: false,
    modal: {
        active: false,
    },
    pageIndex: 0,
    nextPageExists: false,
};

export const apiKeysReducer = (state = initialApiKeysState, action: ApiKeysAction): ApiKeysState => {
    switch (action.type) {
        case API_KEYS_DATA:
            return {
                ...state,
                apiKeys: sliceArray(action.payload.apiKeys, defaultStorageLimit()),
                dataLoaded: true,
                error: undefined,
                pageIndex: action.payload.pageIndex,
                nextPageExists: action.payload.nextPageExists,
            };
        case API_KEY_CREATE:
            return {
                ...state,
                apiKeys: state.apiKeys.concat(action.payload),
                error: undefined,
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
                error: undefined,
            };
        case API_KEY_DELETE:
            return {
                ...state,
                apiKeys: state.apiKeys.filter(apiKey => apiKey.kid !== action.payload.kid),
                error: undefined,
            };
        case API_KEYS_2FA_MODAL:
            return {
                ...state,
                modal: action.payload,
                error: undefined,
            };
        case API_KEYS_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};
