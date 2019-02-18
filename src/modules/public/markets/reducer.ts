import { CommonError, CommonState } from '../../types';
import { MarketsAction } from './actions';
import {
    MARKETS_DATA,
    MARKETS_ERROR,
    MARKETS_FETCH,
    MARKETS_TICKERS_DATA,
    MARKETS_TICKERS_ERROR,
    MARKETS_TICKERS_FETCH,
    SET_CURRENT_MARKET,
} from './constants';
import { Market, Ticker } from './types';

export interface MarketsState extends CommonState {
    list: Market[];
    currentMarket: Market | undefined;
    tickers: {
        [pair: string]: Ticker;
    };
    tickerLoading: boolean;
    loading: boolean;
    error?: CommonError;
}

export const initialMarketsState: MarketsState = {
    list: [],
    currentMarket: undefined,
    tickers: {},
    tickerLoading: false,
    loading: false,
};

export const marketsReducer = (state = initialMarketsState, action: MarketsAction) => {
    switch (action.type) {
        case MARKETS_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case MARKETS_DATA:
            return {
                ...state,
                loading: false,
                error: undefined,
                list: action.payload,
            };
        case MARKETS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case SET_CURRENT_MARKET:
            return {
                ...state,
                currentMarket: action.payload,
            };

        case MARKETS_TICKERS_FETCH:
            return {
                ...state,
                tickerLoading: true,
                error: undefined,
            };
        case MARKETS_TICKERS_DATA:
            return {
                ...state,
                tickerLoading: false,
                tickers: action.payload,
            };
        case MARKETS_TICKERS_ERROR:
            return {
                ...state,
                tickerLoading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};
