import {
    KLINE_DATA,
    KLINE_FETCH,
    KLINE_PUSH,
    KLINE_UPDATE_PERIOD,
    KLINE_UPDATE_TIME_RANGE,
} from './constants';

export type KlineRawElement = string | number;

export interface KlinePush {
    type: typeof KLINE_PUSH;
    payload: {
        marketId: string;
        kline: KlineRawElement[];
        period: string;
    };
}

export interface KlineFetch {
    type: typeof KLINE_FETCH;
    payload: {
        market: string;
        resolution: number;
        from: string;
        to: string;
    };
}

export interface KlineData {
    type: typeof KLINE_DATA;
    // tslint:disable-next-line:no-any
    payload: any;
}

export interface KlineUpdateTimeRange {
    type: typeof KLINE_UPDATE_TIME_RANGE;
    payload: {
        from: number;
        to: number;
    };
}

export interface KlineUpdatePeriod {
    type: typeof KLINE_UPDATE_PERIOD;
    payload: string;
}

export type KlineActions = KlinePush
    | KlineFetch
    | KlineData
    | KlineUpdateTimeRange
    | KlineUpdatePeriod;


export const klinePush = (payload: KlinePush['payload']): KlinePush => ({
    type: KLINE_PUSH,
    payload,
});

export const klineFetch = (payload: KlineFetch['payload']): KlineFetch => ({
    type: KLINE_FETCH,
    payload,
});

export const klineData = (payload: KlineData['payload']): KlineData => ({
    type: KLINE_DATA,
    payload,
});

export const klineUpdateTimeRange = (payload: KlineUpdateTimeRange['payload']): KlineUpdateTimeRange => ({
    type: KLINE_UPDATE_TIME_RANGE,
    payload,
});

export const klineUpdatePeriod = (payload: KlineUpdatePeriod['payload']): KlineUpdatePeriod => ({
    type: KLINE_UPDATE_PERIOD,
    payload,
});
