import { CommonError } from '../../types';
import {
    P2P_TRADES_HISTORY_DATA,
    P2P_TRADES_HISTORY_ERROR,
    P2P_TRADES_HISTORY_FETCH,
} from './constants';
import { P2PTradesHistory } from './types';

export interface P2PTradesHistoryFetch {
    type: typeof P2P_TRADES_HISTORY_FETCH;
    payload: {
        page: number;
        limit: number;
        side?: string;
    };
}
export interface P2PTradesHistoryData {
    type: typeof P2P_TRADES_HISTORY_DATA;
    payload: {
        list: P2PTradesHistory[];
        page: number;
        total: number;
    }
}

export interface P2PTradesHistoryError {
    type: typeof P2P_TRADES_HISTORY_ERROR;
    error: CommonError;
}

export type P2PTradesHistoryActions =
    P2PTradesHistoryFetch
    | P2PTradesHistoryData
    | P2PTradesHistoryError;

export const p2pTradesHistoryFetch = (payload?: P2PTradesHistoryFetch['payload']): P2PTradesHistoryFetch => ({
    type: P2P_TRADES_HISTORY_FETCH,
    payload,
});

export const p2pTradesHistoryData = (payload: P2PTradesHistoryData['payload']): P2PTradesHistoryData => ({
    type: P2P_TRADES_HISTORY_DATA,
    payload,
});

export const p2pTradesHistoryError = (error: CommonError): P2PTradesHistoryError => ({
    type: P2P_TRADES_HISTORY_ERROR,
    error,
});
