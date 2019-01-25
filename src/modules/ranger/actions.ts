import { CommonError } from '../types';
import {

    RANGER_CONNECT_DATA,
    RANGER_CONNECT_ERROR,
    RANGER_CONNECT_FETCH,
    RANGER_DIRECT_WRITE,
    RANGER_DISCONNECT,
    RANGER_DISCONNECT_DATA,
} from './constants';

interface RangerConnectedEvent {
    isTrusted: boolean;
}

export interface RangerConnectFetch {
    type: typeof RANGER_CONNECT_FETCH;
    payload: {};
}

export interface RangerConnectData {
    type: typeof RANGER_CONNECT_DATA;
    payload: {
        isTrusted: boolean;
    };
}

export interface RangerDisconnect {
    type: typeof RANGER_DISCONNECT;
}

export interface RangerDisconnectData {
    type: typeof RANGER_DISCONNECT_DATA;
}

export interface RangerSubscribe {
    type: typeof RANGER_DIRECT_WRITE;
    payload: {
        channels: string[];
    };
}

export interface RangerDirectMessage {
    type: typeof RANGER_DIRECT_WRITE;
    // tslint:disable-next-line no-any
    payload: any;
}

export interface RangerConnectError {
    type: typeof RANGER_CONNECT_ERROR;
    payload?: {
        code: number;
        message: string;
    };
}


export type RangerErrorType = typeof RANGER_CONNECT_ERROR;

export const rangerConnect = (): RangerConnectFetch => ({
    type: RANGER_CONNECT_FETCH,
    payload: {},
});

export const rangerConnectData = (payload: RangerConnectedEvent): RangerConnectData => ({
    type: RANGER_CONNECT_DATA,
    payload,
});

export const rangerConnectError = (payload: CommonError): RangerConnectError => ({
    type: RANGER_CONNECT_ERROR,
    payload,
});

export const rangerDirectMessage = (payload: RangerDirectMessage['payload']): RangerDirectMessage => ({
    type: RANGER_DIRECT_WRITE,
    payload,
});

export const rangerSubscribe = (payload: RangerSubscribe['payload']): RangerDirectMessage => ({
    type: RANGER_DIRECT_WRITE,
    payload: { event: 'subscribe', streams: payload.channels },
});

export const rangerUnsubscribe = (payload: RangerSubscribe['payload']): RangerDirectMessage => ({
    type: RANGER_DIRECT_WRITE,
    payload: { event: 'unsubscribe', streams: payload.channels },
});

export const rangerSubscribeMarket = (marketId: string): RangerDirectMessage => rangerSubscribe({ channels: [`${marketId}.trades`] });
export const rangerUnsubscribeMarket = (marketId: string): RangerDirectMessage => rangerUnsubscribe({ channels: [`${marketId}.trades`] });

export const rangerDisconnect = (): RangerDisconnect => ({
    type: RANGER_DISCONNECT,
});

export const rangerDisconnectData = (): RangerDisconnectData => ({
    type: RANGER_DISCONNECT_DATA,
});
