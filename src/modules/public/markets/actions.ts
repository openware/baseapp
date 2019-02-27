import {
    MARKETS_DATA,
    MARKETS_ERROR,
    MARKETS_FETCH,
    MARKETS_SET_CURRENT_MARKET,
    MARKETS_SET_CURRENT_MARKET_IFUNSET,
    MARKETS_TICKERS_DATA,
    MARKETS_TICKERS_ERROR,
    MARKETS_TICKERS_FETCH,
    MARKETS_TICKERS_PUSH,
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
}

export interface SetCurrentMarket {
    type: typeof MARKETS_SET_CURRENT_MARKET;
    payload: Market;
}

export interface SetCurrentMarketIfUnset {
    type: typeof MARKETS_SET_CURRENT_MARKET_IFUNSET;
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
}

export type MarketsAction =
    MarketsFetch
    | MarketsData
    | MarketsError
    | MarketsTickersFetch
    | MarketsTickersData
    | MarketsTickersError
    | SetCurrentMarket
    | SetCurrentMarketIfUnset;

export const marketsFetch = (): MarketsFetch => ({
    type: MARKETS_FETCH,
});

export const marketsData = (payload: MarketsData['payload']): MarketsData => ({
    type: MARKETS_DATA,
    payload,
});

export const marketsError = (): MarketsError => ({
    type: MARKETS_ERROR,
});

export const setCurrentMarket =
    (payload: SetCurrentMarket['payload']): SetCurrentMarket => ({
        type: MARKETS_SET_CURRENT_MARKET,
        payload,
    });

export const setCurrentMarketIfUnset =
    (payload: SetCurrentMarketIfUnset['payload']): SetCurrentMarketIfUnset => ({
        type: MARKETS_SET_CURRENT_MARKET_IFUNSET,
        payload,
    });

export const marketsTickersFetch = (): MarketsTickersFetch => ({
    type: MARKETS_TICKERS_FETCH,
});

export const marketsTickersData = (payload: MarketsTickersData['payload']): MarketsTickersData => ({
    type: MARKETS_TICKERS_DATA,
    payload,
});

export const marketsTickersError = (): MarketsTickersError => ({
    type: MARKETS_TICKERS_ERROR,
});

export const marketsTickersPush = (payload: MarketsTickersPush['payload']): MarketsTickersPush => ({
    type: MARKETS_TICKERS_PUSH,
    payload,
});
