import {
    HISTORY_DATA,
    HISTORY_ERROR,
    HISTORY_FETCH,
    HISTORY_RESET,
    SET_FULL_HISTORY_LENGTH,
} from './constants';
import { CurrencyHistory } from './reducer';

interface CurrencyHistoryFetchPayload {
    currency: string;
    page: number;
    type: string;
    fullHistory: number;
}

interface CurrencyHistorySuccessPayload {
    list: CurrencyHistory[];
    page: number;
}

export interface CurrencyHistoryFetch {
    type: typeof HISTORY_FETCH;
    payload: CurrencyHistoryFetchPayload;
}

export interface CurrencyHistoryData {
    type: typeof HISTORY_DATA;
    payload: CurrencyHistorySuccessPayload;
}

export interface CurrencyHistoryError {
    type: typeof HISTORY_ERROR;
    payload: CurrencyHistory[];
}

export interface CurrencyHistoryReset {
    type: typeof HISTORY_RESET;
}

export interface SetFullHistoryLength {
    type: typeof SET_FULL_HISTORY_LENGTH;
    payload: number;
}

export type CurrencyHistoryActions =
    CurrencyHistoryFetch
    | CurrencyHistoryData
    | CurrencyHistoryError
    | CurrencyHistoryReset
    | SetFullHistoryLength;

export const fetchCurrencyHistory = (payload: CurrencyHistoryFetchPayload): CurrencyHistoryFetch => ({
    type: HISTORY_FETCH,
    payload,
});

export const successCurrencyHistory = (payload: CurrencyHistorySuccessPayload): CurrencyHistoryData => ({
    type: HISTORY_DATA,
    payload,
});

export const failCurrencyHistory = (payload: CurrencyHistory[]): CurrencyHistoryError => ({
    type: HISTORY_ERROR,
    payload,
});

export const resetCurrencyHistory = (): CurrencyHistoryReset => ({
    type: HISTORY_RESET,
});

export const setFullHistoryLength = (payload: number): SetFullHistoryLength => ({
    type: SET_FULL_HISTORY_LENGTH,
    payload,
});
