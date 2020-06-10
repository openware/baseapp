import {
    SEND_ACCESS_TOKEN_DATA,
    SEND_ACCESS_TOKEN_ERROR,
    SEND_ACCESS_TOKEN_FETCH,
} from './constants';

export interface SendAccessTokenFetch {
    type: typeof SEND_ACCESS_TOKEN_FETCH;
    payload: {
        whitelink_token: string;
    };
}

export interface SendAccessTokenData {
    type: typeof SEND_ACCESS_TOKEN_DATA;
}

export interface SendAccessTokenError {
    type: typeof SEND_ACCESS_TOKEN_ERROR;
}

export type SendAccessTokenAction = SendAccessTokenFetch
    | SendAccessTokenData
    | SendAccessTokenError;

export const sendAccessToken = (payload: SendAccessTokenFetch['payload']): SendAccessTokenFetch => ({
    type: SEND_ACCESS_TOKEN_FETCH,
    payload,
});

export const sendAccessTokenData = (): SendAccessTokenData => ({
    type: SEND_ACCESS_TOKEN_DATA,
});

export const sendAccessTokenError = (): SendAccessTokenError => ({
    type: SEND_ACCESS_TOKEN_ERROR,
});
