import {
    MARKET_UPDATE_FETCH,
    MARKETS_LIST_DATA,
    MARKETS_LIST_ERROR,
    MARKETS_LIST_FETCH,
    MARKET_UPDATE_ERROR,
    MARKET_UPDATE_DATA,
} from './constants';
import { MarketItem, MarketsAdminAction, MarketUpdateItem } from './actions';

export interface MarketsAdminState {
    loading: boolean;
    list: MarketItem[];
    successMarketsUpdate: boolean;
    enabledMarkets: MarketUpdateItem[];
}

export const initialMarketsAdminState: MarketsAdminState = {
    loading: false,
    list: [],
    successMarketsUpdate: false,
    enabledMarkets: [],
};

export const marketsAdminReducer = (state = initialMarketsAdminState, action: MarketsAdminAction) => {
    switch (action.type) {
        case MARKETS_LIST_FETCH:
            return {
                ...state,
                loading: true,
            };
        case MARKETS_LIST_DATA:
            return {
                ...state,
                loading: false,
                list: action.payload.list,
            };
        case MARKETS_LIST_ERROR:
            return {
                ...state,
                loading: false,
                list: [],
                total: 0,
            };
        case MARKET_UPDATE_FETCH:
            return {
                ...state,
                loading: true,
                enabledMarkets: action.payload,
            };
        case MARKET_UPDATE_DATA:
            return {
                ...state,
                loading: false,
                successMarketsUpdate: true,
            };
        case MARKET_UPDATE_ERROR:
            return {
              ...state,
              loading: false,
            };
        default:
            return {
                ...state,
            };
    }
};
