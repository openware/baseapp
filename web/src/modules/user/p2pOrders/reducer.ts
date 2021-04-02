import { CommonError } from '../../types';
import { P2PTradesHistoryActions } from './actions';
import {
    P2P_TRADES_HISTORY_DATA,
    P2P_TRADES_HISTORY_ERROR,
    P2P_TRADES_HISTORY_FETCH,
} from './constants';
import { P2PTradesHistory } from './types';

export interface P2PTradesHistoryState {
    page: number;
    total: number;
    list: P2PTradesHistory[];
    fetching: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialP2PTradesHistoryState: P2PTradesHistoryState = {
    page: 0,
    total: 0,
    list: [],
    fetching: false,
    success: false,
};

export const p2pTradesHistoryReducer = (state = initialP2PTradesHistoryState, action: P2PTradesHistoryActions) => {
    switch (action.type) {
        case P2P_TRADES_HISTORY_FETCH:
            return {
                ...state,
                fetching: true,
            };
        case P2P_TRADES_HISTORY_DATA:
            return {
                ...state,
                list: action.payload.list,
                page: action.payload.page,
                total: action.payload.total,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_TRADES_HISTORY_ERROR:
            return {
                ...state,
                list: [],
                page: 0,
                total: 0,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};
