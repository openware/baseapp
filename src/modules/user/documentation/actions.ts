import { CommonError } from '../../types';
import {
    DOC_TRADE_USER_API_DATA,
    DOC_TRADE_USER_API_ERROR,
    DOC_TRADE_USER_API_FETCH,
} from './constants';
import { DocTradeUserApiDataInterface } from './types';

export interface DocTradeUserApiFetch {
    type: typeof DOC_TRADE_USER_API_FETCH;
}

export interface DocTradeUserApiData {
    type: typeof DOC_TRADE_USER_API_DATA;
    payload: DocTradeUserApiDataInterface;
}

export interface DocTradeUserApiError {
    type: typeof DOC_TRADE_USER_API_ERROR;
    payload: CommonError;
}

export type DocumentationAction =
    DocTradeUserApiFetch
    | DocTradeUserApiData
    | DocTradeUserApiError;

export const docTradeUserApiFetch = (): DocTradeUserApiFetch => ({
    type: DOC_TRADE_USER_API_FETCH,
});

export const docTradeUserApiData = (payload: DocTradeUserApiData['payload']): DocTradeUserApiData => ({
    type: DOC_TRADE_USER_API_DATA,
    payload,
});

export const docTradeUserApiError = (payload: DocTradeUserApiError['payload']): DocTradeUserApiError => ({
    type: DOC_TRADE_USER_API_ERROR,
    payload,
});
