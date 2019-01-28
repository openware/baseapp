import { CommonError } from '../types';
import {
    MARKETS_DATA,
    MARKETS_ERROR,
    MARKETS_FETCH,
    MARKETS_TICKERS_DATA,
    MARKETS_TICKERS_ERROR,
    MARKETS_TICKERS_FETCH,
    MARKETS_TICKERS_PUSH,
    SET_CURRENT_MARKET,
} from './constants';
import { Market, Ticker, TickerEvent } from './types';

export interface MarketsFetch {
    type: typeof MARKETS_FETCH;
}

export interface MarketsData {
    type: typeof MARKETS_DATA;
    payload: Market[];
}

export interface MarketsError {
    type: typeof MARKETS_ERROR;
    payload?: CommonError;
}

export interface SetCurrentMarket {
    type: typeof SET_CURRENT_MARKET;
    payload: Market;
}

export interface MarketsTickersFetch {
    type: typeof MARKETS_TICKERS_FETCH;
}

export interface MarketsTickersPush {
    type: typeof MARKETS_TICKERS_PUSH;
    payload: {
        [pair: string]: TickerEvent;
    };
}

export interface MarketsTickersData {
    type: typeof MARKETS_TICKERS_DATA;
    payload: {
        [pair: string]: Ticker;
    };
}

export interface MarketsTickersError {
    type: typeof MARKETS_TICKERS_ERROR;
    payload?: CommonError;
}

export type MarketsAction =
    MarketsFetch
    | MarketsData
    | MarketsError
    | MarketsTickersFetch
    | MarketsTickersData
    | MarketsTickersError
    | SetCurrentMarket;

export const marketsFetch = (): MarketsFetch => ({
    type: MARKETS_FETCH,
});

export const marketsData = (payload: MarketsData['payload']): MarketsData => ({
    type: MARKETS_DATA,
    payload,
});

export const marketsError = (payload: MarketsError['payload']): MarketsError => ({
    type: MARKETS_ERROR,
    payload,
});

export const marketsTickersError = (payload: MarketsError['payload']): MarketsTickersError => ({
    type: MARKETS_TICKERS_ERROR,
    payload,
});

export const setCurrentMarket =
    (payload: SetCurrentMarket['payload']): SetCurrentMarket => ({
        type: SET_CURRENT_MARKET,
        payload,
    });

export const marketsTickersFetch = (): MarketsTickersFetch => ({
    type: MARKETS_TICKERS_FETCH,
});

export const marketsTickersData = (payload: MarketsTickersData['payload']): MarketsTickersData => ({
    type: MARKETS_TICKERS_DATA,
    payload,
});

export const marketsTickersPush = (payload: MarketsTickersPush['payload']): MarketsTickersPush => ({
    type: MARKETS_TICKERS_PUSH,
    payload,
});
