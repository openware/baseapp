import { CommonState } from '../../types';
import { KlineActions, KlineRawElement } from './actions';
import {
    KLINE_PUSH,
} from './constants';
import { KlineEvent } from './types';

export interface KlineState extends CommonState {
    last?: KlineEvent;
    marketId?: string;
    period?: string;
    loading: boolean;
}

export const klineArrayToObject = (el: KlineRawElement[]): KlineEvent => {
    const [time, open, high, low, close, volume] = el.map((e: KlineRawElement) => {
        switch (typeof e) {
            case 'number':
                return e;
            case 'string':
                return Number.parseFloat(e);
            default:
                throw (new Error(`unexpected type ${typeof e} in kline: ${el}`));
        }
    });
    return {
        time: time * 1e3,
        open,
        high,
        low,
        close,
        volume,
    };
};

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
