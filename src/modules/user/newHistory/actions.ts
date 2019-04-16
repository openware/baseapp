import { CommonError } from '../../types';
import {
    NEW_HISTORY_DATA,
    NEW_HISTORY_ERROR,
    NEW_HISTORY_FETCH,
    NEW_HISTORY_RESET,
} from './constants';
import { WalletNewHistoryList } from './types';

interface NewHistoryFetchPayload {
    currency?: string;
    filter: string;
    sort?: string;
    order?: string;
    time_from?: string;
    time_to?: string;
}

interface NewHistorySuccessPayload {
    list: WalletNewHistoryList;
}

export interface NewHistoryFetch {
    type: typeof NEW_HISTORY_FETCH;
    payload: NewHistoryFetchPayload;
}

export interface NewHistoryData {
    type: typeof NEW_HISTORY_DATA;
    payload: NewHistorySuccessPayload;
}

export interface NewHistoryError {
    type: typeof NEW_HISTORY_ERROR;
    payload: CommonError;
}

export interface NewHistoryReset {
    type: typeof NEW_HISTORY_RESET;
}

export type NewHistoryActions =
    NewHistoryFetch
    | NewHistoryData
    | NewHistoryError
    | NewHistoryReset;


export const fetchNewHistory = (payload: NewHistoryFetchPayload): NewHistoryFetch => ({
    type: NEW_HISTORY_FETCH,
    payload,
});

export const successNewHistory = (payload: NewHistorySuccessPayload): NewHistoryData => ({
    type: NEW_HISTORY_DATA,
    payload,
});

export const failNewHistory = (payload: CommonError): NewHistoryError => ({
    type: NEW_HISTORY_ERROR,
    payload,
});

export const resetNewHistory = (): NewHistoryReset => ({
    type: NEW_HISTORY_RESET,
});
