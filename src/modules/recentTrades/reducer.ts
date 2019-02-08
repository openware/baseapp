import { defaultStorageLimit } from '../../api';
import { localeDate } from '../../helpers/localeDate';
import { getTimezone } from '../../helpers/timezone';
import { PublicTrade } from '../history';
import { CommonState } from '../types';
import { RecentTradesActions } from './actions';
import {
    RECENT_TRADES_DATA,
    RECENT_TRADES_ERROR,
    RECENT_TRADES_FETCH,
    RECENT_TRADES_PUSH,
} from './constants';
import { PublicTradeEvent } from './types';

export interface RecentTradesState extends CommonState {
    list: PublicTrade[];
}

const initialState: RecentTradesState = {
    list: [],
    loading: false,
};

export const convertTradeEventToTrade = (market: string, trade: PublicTradeEvent): PublicTrade => ({
    market,
    id: trade.tid,
    created_at: localeDate(trade.date, getTimezone(), ''),
    maker_type: trade.type,
    price: String(trade.price),
    volume: String(trade.amount),
    funds: String(Number(trade.price) * Number(trade.amount)),
});

export const convertTradeEventList = (market: string, trades: PublicTradeEvent[]): PublicTrade[] =>
    trades.map(trade => convertTradeEventToTrade(market, trade));


export const recentTradesReducer = (state = initialState, action: RecentTradesActions) => {
    switch (action.type) {
        case RECENT_TRADES_DATA: {
            return {
                list: action.payload.slice(0, defaultStorageLimit()),
                loading: false,
            };
        }
        case RECENT_TRADES_ERROR: {
            return {
                list: [],
                loading: false,
                error: action.error,
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
            return {
                ...state,
                list: [
                    ...lastTrades,
                    ...state.list,
                ].slice(0, defaultStorageLimit()),
            };
        }
        default:
            return state;
    }
};
