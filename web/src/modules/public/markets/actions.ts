import { CommonError } from '../../types';
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
    MARKET_PRICE_DATA,
    MARKET_PRICE_ERROR,
    MARKET_PRICE_FETCH,
} from './constants';
import { Market, MarketPriceInterface, Ticker, TickerEvent } from './types';

export interface MarketsFetch {
    type: typeof MARKETS_FETCH;
    payload?: {
        type: string;
    };
}

export interface MarketsData {
    type: typeof MARKETS_DATA;
    payload: Market[];
}

export interface MarketsError {
    type: typeof MARKETS_ERROR;
    error: CommonError;
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
    error: CommonError;
}

export interface MarketPriceFetch {
    type: typeof MARKET_PRICE_FETCH;
    payload: {
        market: string;
        side: string;
    };
}

export interface MarketPriceData {
    type: typeof MARKET_PRICE_DATA;
    payload: MarketPriceInterface;
}

export interface MarketPriceError {
    type: typeof MARKET_PRICE_ERROR;
    error: CommonError;
}

export type MarketsAction =
    | MarketsFetch
    | MarketsData
    | MarketsError
    | MarketsTickersFetch
    | MarketsTickersData
    | MarketsTickersError
    | SetCurrentMarket
    | SetCurrentMarketIfUnset
    | MarketPriceFetch
    | MarketPriceData
    | MarketPriceError;

export const marketsFetch = (payload?: MarketsFetch['payload']): MarketsFetch => ({
    type: MARKETS_FETCH,
    payload,
});

export const marketsData = (payload: MarketsData['payload']): MarketsData => ({
    type: MARKETS_DATA,
    payload,
});

export const marketsError = (error: CommonError): MarketsError => ({
    type: MARKETS_ERROR,
    error,
});

export const setCurrentMarket = (payload: SetCurrentMarket['payload']): SetCurrentMarket => ({
    type: MARKETS_SET_CURRENT_MARKET,
    payload,
});

export const setCurrentMarketIfUnset = (payload: SetCurrentMarketIfUnset['payload']): SetCurrentMarketIfUnset => ({
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

export const marketsTickersError = (error: CommonError): MarketsTickersError => ({
    type: MARKETS_TICKERS_ERROR,
    error,
});

export const marketsTickersPush = (payload: MarketsTickersPush['payload']): MarketsTickersPush => ({
    type: MARKETS_TICKERS_PUSH,
    payload,
});

export const marketPriceFetch = (payload: MarketPriceFetch['payload']): MarketPriceFetch => ({
    type: MARKET_PRICE_FETCH,
    payload,
});

export const marketPriceData = (payload: MarketPriceData['payload']): MarketPriceData => ({
    type: MARKET_PRICE_DATA,
    payload,
});

export const marketPriceError = (error: CommonError): MarketPriceError => ({
    type: MARKET_PRICE_ERROR,
    error,
});
