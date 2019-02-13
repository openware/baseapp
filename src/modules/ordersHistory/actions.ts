import { Order } from '../orders';
import {
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
    list: Order[];
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

export type OrdersHistoryAction =
    UserOrdersHistoryFetch
    | UserOrdersHistoryData
    | UserOrdersHistoryError
    | TestOrdersHistoryState;


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
