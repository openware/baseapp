import { CommonError } from '../../types';
import {
    SEND_BLOCKLIST_ACCESS_TOKEN_DATA,
    SEND_BLOCKLIST_ACCESS_TOKEN_ERROR,
    SEND_BLOCKLIST_ACCESS_TOKEN_FETCH,
    SET_BLOCKLIST_STATUS,
} from './constants';

export interface SendAccessTokenFetch {
    type: typeof SEND_BLOCKLIST_ACCESS_TOKEN_FETCH;
    payload: {
        whitelink_token: string;
    };
}

export interface SendAccessTokenData {
    type: typeof SEND_BLOCKLIST_ACCESS_TOKEN_DATA;
}

export interface SendAccessTokenError {
    type: typeof SEND_BLOCKLIST_ACCESS_TOKEN_ERROR;
    error: CommonError;
}

export interface SetBlocklistStatus {
    type: typeof SET_BLOCKLIST_STATUS;
    payload: {
        status: string;
    };
}

export type SendAccessTokenAction = SendAccessTokenFetch
    | SendAccessTokenData
    | SendAccessTokenError
    | SetBlocklistStatus;

export const sendAccessToken = (payload: SendAccessTokenFetch['payload']): SendAccessTokenFetch => ({
    type: SEND_BLOCKLIST_ACCESS_TOKEN_FETCH,
    payload,
});

export const sendAccessTokenData = (): SendAccessTokenData => ({
    type: SEND_BLOCKLIST_ACCESS_TOKEN_DATA,
});

export const sendAccessTokenError = (error: CommonError): SendAccessTokenError => ({
    type: SEND_BLOCKLIST_ACCESS_TOKEN_ERROR,
    error,
});

export const setBlocklistStatus = (payload: SetBlocklistStatus['payload']): SetBlocklistStatus => ({
    type: SET_BLOCKLIST_STATUS,
    payload,
});
