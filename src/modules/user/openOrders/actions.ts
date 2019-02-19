import { Market } from '../../public/markets';
import { OrderAPI, OrderCommon, OrderEvent } from '../../types';
import {
    OPEN_ORDERS_CANCEL_DATA,
    OPEN_ORDERS_CANCEL_ERROR,
    OPEN_ORDERS_CANCEL_FETCH,
    USER_OPEN_ORDERS_APPEND,
    USER_OPEN_ORDERS_DATA,
    USER_OPEN_ORDERS_ERROR,
    USER_OPEN_ORDERS_FETCH,
    USER_OPEN_ORDERS_RESET,
    USER_OPEN_ORDERS_UPDATE,
} from './constants';


export interface UserOpenOrdersFetch {
    type: typeof USER_OPEN_ORDERS_FETCH;
    payload: {
        market: Market,
    };
}

export interface UserOpenOrdersData {
    type: typeof USER_OPEN_ORDERS_DATA;
    payload: OrderAPI[];
}

export interface UserOpenOrdersError {
    type: typeof USER_OPEN_ORDERS_ERROR;
}

export interface UserOpenOrdersUpdate {
    type: typeof USER_OPEN_ORDERS_UPDATE;
    payload: OrderEvent;
}

export interface UserOpenOrdersAppend {
    type: typeof USER_OPEN_ORDERS_APPEND;
    payload: OrderAPI;
}

export interface UserOpenOrdersReset {
    type: typeof USER_OPEN_ORDERS_RESET;
}

export interface OpenOrdersCancelFetch {
    type: typeof OPEN_ORDERS_CANCEL_FETCH;
    payload: {
        id: string | number;
        list: OrderCommon[];
    };
}

export interface OpenOrdersCancelData {
    type: typeof OPEN_ORDERS_CANCEL_DATA;
    payload: OrderCommon[];
}

export interface OpenOrdersCancelError {
    type: typeof OPEN_ORDERS_CANCEL_ERROR;
}

export type OpenOrdersAction =
    UserOpenOrdersFetch
    | UserOpenOrdersData
    | UserOpenOrdersError
    | UserOpenOrdersUpdate
    | UserOpenOrdersAppend
    | UserOpenOrdersReset
    | OpenOrdersCancelFetch
    | OpenOrdersCancelData
    | OpenOrdersCancelError;

export const userOpenOrdersFetch = (payload: UserOpenOrdersFetch['payload']): UserOpenOrdersFetch => ({
    type: USER_OPEN_ORDERS_FETCH,
    payload,
});

export const userOpenOrdersData = (payload: UserOpenOrdersData['payload']): UserOpenOrdersData => ({
    type: USER_OPEN_ORDERS_DATA,
    payload,
});

export const userOpenOrdersUpdate = (payload: UserOpenOrdersUpdate['payload']): UserOpenOrdersUpdate => ({
    type: USER_OPEN_ORDERS_UPDATE,
    payload,
});

export const userOpenOrdersAppend = (payload: UserOpenOrdersAppend['payload']): UserOpenOrdersAppend => ({
    type: USER_OPEN_ORDERS_APPEND,
    payload,
});

export const userOpenOrdersError = (): UserOpenOrdersError => ({
    type: USER_OPEN_ORDERS_ERROR,
});

export const userOpenOrdersReset = (): UserOpenOrdersReset => ({
    type: USER_OPEN_ORDERS_RESET,
});

export const openOrdersCancelFetch = (payload: OpenOrdersCancelFetch['payload']): OpenOrdersCancelFetch => ({
    type: OPEN_ORDERS_CANCEL_FETCH,
    payload,
});

export const openOrdersCancelData = (payload: OpenOrdersCancelData['payload']): OpenOrdersCancelData => ({
    type: OPEN_ORDERS_CANCEL_DATA,
    payload,
});

export const openOrdersCancelError = (): OpenOrdersCancelError => ({
    type: OPEN_ORDERS_CANCEL_ERROR,
});
