import { Trade } from '../history/trades';
import { Market } from '../markets';
import { CommonError } from '../types';
import {
    RECENT_TRADES_DATA,
    RECENT_TRADES_ERROR,
    RECENT_TRADES_FETCH,
} from './constants';

// tslint:disable no-any

export interface RecentTradesFetch {
    type: typeof RECENT_TRADES_FETCH;
    payload: Market;
}

export interface RecentTradesData {
    type: typeof RECENT_TRADES_DATA;
    payload: Trade[];
}

export interface RecentTradesError {
    type: typeof RECENT_TRADES_ERROR;
    error: CommonError;
}

export type RecentTradesActions =
    RecentTradesFetch
    | RecentTradesError
    | RecentTradesData;

export const recentTradesFetch = (payload: RecentTradesFetch['payload']): RecentTradesFetch => ({
    type: RECENT_TRADES_FETCH,
    payload,
});

export const recentTradesData = (payload: RecentTradesData['payload']): RecentTradesData => ({
    type: RECENT_TRADES_DATA,
    payload,
});

export const recentTradesError = (error: RecentTradesError['error']): RecentTradesError => ({
    type: RECENT_TRADES_ERROR,
    error,
});
