import { klineArrayToObject } from '../../components/TradingChart/api';
import { CommonState } from '../types';
import { KlineActions } from './actions';
import {
    KLINE_PUSH,
} from './constants';
import { KlineEvent } from './types';

export interface KlineState extends CommonState {
    last?: KlineEvent;
    marketId?: string;
    period?: string;
}

const initialState: KlineState = {
    last: undefined,
    marketId: undefined,
    period: undefined,
    loading: false,
};

export const klineReducer = (state = initialState, action: KlineActions): KlineState => {
    switch (action.type) {
        case KLINE_PUSH:
            const { kline, marketId, period } = action.payload;
            return {
                ...state,
                marketId,
                period,
                last: klineArrayToObject(kline),
            };
        default:
            return state;
    }
};
