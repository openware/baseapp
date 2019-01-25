import { defaultStorageLimit } from '../../../api';
import { localeDate } from '../../../helpers/localeDate';
import { getTimezone } from '../../../helpers/timezone';
import { TradesActions } from './actions';
import { TRADES_DATA, TRADES_ERROR, TRADES_FETCH, TRADES_PUSH } from './constants';
import { MakerType, PrivateTrade, PrivateTradeEvent, PrivateTradesState } from './types';

const initialState: PrivateTradesState = {
    list: [],
    loading: false,
};

const makerTypeMap = {
    ask: 'sell',
    bid: 'buy',
};

export const kindToMakerType = (kind: string): MakerType => makerTypeMap[kind];

export const tradeEventToTrade = (tradeEvent: PrivateTradeEvent): PrivateTrade => {
    const { id, at, market, kind, price, volume } = tradeEvent;
    const funds = Number(price) * Number(volume);
    const trade: PrivateTrade = {
        id,
        price,
        volume,
        funds: `${funds}`,
        market,
        created_at: localeDate(at, getTimezone(), ''),
        maker_type: kindToMakerType(kind),
    };
    return trade;
};

export const tradesReducer = (state = initialState, action: TradesActions) => {
    switch (action.type) {
        case TRADES_FETCH:
            return {
                ...state,
                loading: true,
            };
        case TRADES_DATA:
            return {
                list: action.payload.slice(0, defaultStorageLimit()),
                loading: false,
            };
        case TRADES_PUSH:
            return {
                ...state,
                list: [
                    ...[tradeEventToTrade(action.payload)],
                    ...state.list,
                ].slice(0, defaultStorageLimit()),
            };
        case TRADES_ERROR:
            return {
                list: [],
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
