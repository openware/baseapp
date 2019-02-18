import { OrderCommon } from '../../types';
import {
    ORDERS_CANCEL_ALL_DATA,
    ORDERS_CANCEL_ALL_ERROR,
    ORDERS_CANCEL_ALL_FETCH,
    ORDERS_HISTORY_CANCEL_DATA,
    ORDERS_HISTORY_CANCEL_ERROR,
    ORDERS_HISTORY_CANCEL_FETCH,
    TEST_ORDERS_HISTORY_STATE,
    USER_ORDERS_HISTORY_DATA,
    USER_ORDERS_HISTORY_ERROR,
    USER_ORDERS_HISTORY_FETCH,
} from './constants';


interface UserOrdersHistoryFetchPayload {
    pageIndex: number;
    limit: number;
    type: string;
}

export interface UserOrdersHistoryDataPayload {
    list: OrderCommon[];
    pageIndex: number;
    total: number;
}

export interface UserOrdersHistoryFetch {
    type: typeof USER_ORDERS_HISTORY_FETCH;
    payload: UserOrdersHistoryFetchPayload;
}

export interface UserOrdersHistoryData {
    type: typeof USER_ORDERS_HISTORY_DATA;
    payload: UserOrdersHistoryDataPayload;
}

export interface UserOrdersHistoryError {
    type: typeof USER_ORDERS_HISTORY_ERROR;
}

export interface TestOrdersHistoryState {
    type: typeof TEST_ORDERS_HISTORY_STATE;
}

export interface OrdersCancelAllFetch {
    type: typeof ORDERS_CANCEL_ALL_FETCH;
    payload: {
        tab: string;
    };
}

export interface OrdersCancelAllData {
    type: typeof ORDERS_CANCEL_ALL_DATA;
    payload: OrderCommon[];
}

export interface OrdersCancelAllError {
    type: typeof ORDERS_CANCEL_ALL_ERROR;
}

export interface OrdersHistoryCancelFetch {
    type: typeof ORDERS_HISTORY_CANCEL_FETCH;
    payload: {
        id: string | number;
        type: string;
        list: OrderCommon[];
    };
}

export interface OrdersHistoryCancelData {
    type: typeof ORDERS_HISTORY_CANCEL_DATA;
    payload: OrderCommon[];
}

export interface OrdersHistoryCancelError {
    type: typeof ORDERS_HISTORY_CANCEL_ERROR;
}

export type OrdersHistoryAction =
    UserOrdersHistoryFetch
    | UserOrdersHistoryData
    | UserOrdersHistoryError
    | TestOrdersHistoryState
    | OrdersCancelAllFetch
    | OrdersCancelAllData
    | OrdersCancelAllError
    | OrdersHistoryCancelFetch
    | OrdersHistoryCancelData
    | OrdersHistoryCancelError;


export const userOrdersHistoryFetch = (payload: UserOrdersHistoryFetchPayload): UserOrdersHistoryFetch => ({
    type: USER_ORDERS_HISTORY_FETCH,
    payload,
});

export const userOrdersHistoryData = (payload: UserOrdersHistoryDataPayload): UserOrdersHistoryData => ({
    type: USER_ORDERS_HISTORY_DATA,
    payload,
});

export const userOrdersHistoryError = (): UserOrdersHistoryError => ({
    type: USER_ORDERS_HISTORY_ERROR,
});

export const ordersCancelAllFetch = (payload: OrdersCancelAllFetch['payload']): OrdersCancelAllFetch => ({
    type: ORDERS_CANCEL_ALL_FETCH,
    payload,
});

export const ordersCancelAllData = (payload: OrdersCancelAllData['payload']): OrdersCancelAllData => ({
    type: ORDERS_CANCEL_ALL_DATA,
    payload,
});

export const ordersCancelAllError = (): OrdersCancelAllError => ({
    type: ORDERS_CANCEL_ALL_ERROR,
});

export const ordersHistoryCancelFetch = (payload: OrdersHistoryCancelFetch['payload']): OrdersHistoryCancelFetch => ({
    type: ORDERS_HISTORY_CANCEL_FETCH,
    payload,
});

export const ordersHistoryCancelData = (payload: OrdersHistoryCancelData['payload']): OrdersHistoryCancelData => ({
    type: ORDERS_HISTORY_CANCEL_DATA,
    payload,
});

export const ordersHistoryCancelError = (): OrdersHistoryCancelError => ({
    type: ORDERS_HISTORY_CANCEL_ERROR,
});
