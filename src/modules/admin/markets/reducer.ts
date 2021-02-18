import {
    MARKET_DATA,
    MARKET_ERROR,
    MARKET_UPDATE_FETCH,
    MARKETS_LIST_DATA,
    MARKETS_LIST_ERROR,
    MARKETS_LIST_FETCH,
} from './constants';
import { MarketItem, MarketsAdminAction } from './actions';

export interface MarketsAdminState {
    loading: boolean;
    list: MarketItem[];
}

export const initialMarketsAdminState: MarketsAdminState = {
    loading: false,
    list: [],
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
            };
        case MARKET_DATA:
            return {
                ...state,
                loading: false,
            };
        case MARKET_ERROR:
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
