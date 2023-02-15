import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { CommonError } from '../../types';
import { PublicTrade } from '../../user/history';
import { RecentTradesActions } from './actions';
import { RECENT_TRADES_DATA, RECENT_TRADES_ERROR, RECENT_TRADES_FETCH, RECENT_TRADES_PUSH } from './constants';
import { PublicTradeEvent } from './types';

export interface RecentTradesState {
    list: PublicTrade[];
    loading: boolean;
    lastTrade?: PublicTrade;
    error?: CommonError;
}

const initialState: RecentTradesState = {
    list: [],
    loading: false,
};

export const convertTradeEventToTrade = (market: string, trade: PublicTradeEvent): PublicTrade => ({
    market,
    id: trade.tid,
    created_at: new Date(trade.date * 1000).toISOString(),
    taker_type: trade.taker_type,
    price: String(trade.price),
    amount: String(trade.amount),
});

export const convertTradeEventList = (market: string, trades: PublicTradeEvent[]): PublicTrade[] =>
    trades.map((trade) => convertTradeEventToTrade(market, trade));

export const extendTradeWithPriceChange = (trade?: PublicTrade, prevTrade?: PublicTrade): PublicTrade | undefined => {
    if (trade) {
        if (prevTrade) {
            return {
                ...trade,
                price_change: String(+trade?.price - +prevTrade?.price),
            };
        }

        return trade;
    }

    return;
};

export const recentTradesReducer = (state = initialState, action: RecentTradesActions) => {
    switch (action.type) {
        case RECENT_TRADES_DATA: {
            return {
                list: sliceArray(action.payload, defaultStorageLimit()),
                loading: false,
                lastTrade: extendTradeWithPriceChange(action.payload?.[0], action.payload?.[1]),
            };
        }
        case RECENT_TRADES_ERROR: {
            return {
                list: [],
                loading: false,
                error: action.error,
                lastTrade: undefined,
            };
        }
        case RECENT_TRADES_FETCH: {
            return {
                ...state,
                loading: true,
            };
        }
        case RECENT_TRADES_PUSH: {
            const lastTrades = convertTradeEventList(action.payload.market, action.payload.trades);
            const updatedList = [...lastTrades, ...state.list];

            return {
                ...state,
                list: sliceArray(updatedList, defaultStorageLimit()),
                lastTrade: extendTradeWithPriceChange(updatedList?.[0], updatedList?.[1]),
            };
        }
        default:
            return state;
    }
};
