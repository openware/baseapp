import {
    KLINE_PUSH,
} from './constants';

export interface KlinePush {
    type: typeof KLINE_PUSH;
    payload: {
        marketId: string;
        kline: string[];
        period: string;
    };
}

export type KlineActions =
    KlinePush;


export const klinePush = (payload: KlinePush['payload']): KlinePush => ({
    type: KLINE_PUSH,
    payload,
});

