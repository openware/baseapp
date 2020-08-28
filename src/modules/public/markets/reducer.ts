import { isFinexEnabled } from '../../../api';
import { buildFilterPrice, FilterPrice } from '../../../filters';
import { CommonState } from '../../types';
import { MarketsAction } from './actions';
import {
    MARKETS_DATA,
    MARKETS_ERROR,
    MARKETS_FETCH,
    MARKETS_SET_CURRENT_MARKET,
    MARKETS_SET_CURRENT_MARKET_IFUNSET,
    MARKETS_TICKERS_DATA,
    MARKETS_TICKERS_ERROR,
    MARKETS_TICKERS_FETCH,
} from './constants';
import { Market, Ticker } from './types';

export interface MarketsState extends CommonState {
    list: Market[];
    filters: {
        [marketId: string]: FilterPrice;
    };
    currentMarket: Market | undefined;
    tickers: {
        [pair: string]: Ticker;
    };
    tickerLoading: boolean;
    loading: boolean;
    timestamp?: number;
    tickersTimestamp?: number;
}

export const initialMarketsState: MarketsState = {
    list: [],
    filters: {},
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
                timestamp: Math.floor(Date.now() / 1000),
            };
        case MARKETS_DATA:
            let filters = {};

            if (isFinexEnabled() && action.payload) {
                filters = action.payload.reduce((result, market: Market) => {
                    result[market.id] = result[market.id] || [];
                    result[market.id] = (market.filters || []).map(buildFilterPrice);

                    return result;
                }, {});
            }

            return {
                ...state,
                loading: false,
                list: action.payload,
                filters: filters,
            };
        case MARKETS_ERROR:
            return {
                ...state,
                loading: false,
            };

        case MARKETS_SET_CURRENT_MARKET:
            return {
                ...state,
                currentMarket: action.payload,
            };

        case MARKETS_SET_CURRENT_MARKET_IFUNSET:
            if (state.currentMarket) {
                return state;
            }

            return {
                ...state,
                currentMarket: action.payload,
            };

        case MARKETS_TICKERS_FETCH:
            return {
                ...state,
                tickerLoading: true,
                tickersTimestamp: Math.floor(Date.now() / 1000),
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
            };

        default:
            return state;
    }
};
