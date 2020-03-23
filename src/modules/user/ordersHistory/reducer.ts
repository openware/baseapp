import { OrderCommon } from '../../types';
import { convertOrderEvent } from '../openOrders/helpers';
import { OrdersHistoryAction } from './actions';
import {
    ORDERS_CANCEL_ALL_DATA,
    ORDERS_CANCEL_ALL_ERROR,
    ORDERS_CANCEL_ALL_FETCH,
    ORDERS_HISTORY_CANCEL_DATA,
    ORDERS_HISTORY_CANCEL_ERROR,
    ORDERS_HISTORY_CANCEL_FETCH,
    ORDERS_HISTORY_DATA,
    ORDERS_HISTORY_ERROR,
    ORDERS_HISTORY_FETCH,
    ORDERS_HISTORY_RANGER_DATA,
    ORDERS_HISTORY_RESET,
} from './constants';
import { insertOrUpdate } from './helpers';

export interface OrdersHistoryState {
    list: OrderCommon[];
    fetching: boolean;
    pageIndex: number;
    cancelAllFetching: boolean;
    cancelAllError: boolean;
    cancelError: boolean;
    cancelFetching: boolean;
}

export const initialOrdersHistoryState: OrdersHistoryState = {
    list: [],
    fetching: false,
    pageIndex: 0,
    cancelAllFetching: false,
    cancelAllError: false,
    cancelError: false,
    cancelFetching: false,
};


export const ordersHistoryReducer = (
    state = initialOrdersHistoryState,
    action: OrdersHistoryAction,
): OrdersHistoryState => {
    switch (action.type) {
        case ORDERS_HISTORY_FETCH:
            return { ...state, fetching: true };
        case ORDERS_HISTORY_DATA:
            return {
                ...state,
                list: action.payload.list,
                fetching: false,
                pageIndex: action.payload.pageIndex,
            };
        case ORDERS_HISTORY_RANGER_DATA:
            return { ...state, cancelFetching: false, list: insertOrUpdate(state.list, convertOrderEvent(action.payload)) };
        case ORDERS_HISTORY_ERROR:
            return { ...state, list: [], pageIndex: 0, fetching: false };
        case ORDERS_CANCEL_ALL_FETCH:
            return { ...state, cancelAllFetching: true, cancelAllError: false };
        case ORDERS_CANCEL_ALL_DATA:
            return { ...state, cancelAllFetching: false, list: action.payload };
        case ORDERS_CANCEL_ALL_ERROR:
            return { ...state, cancelAllFetching: false, cancelAllError: true };
        case ORDERS_HISTORY_CANCEL_FETCH:
            return { ...state, cancelFetching: true, cancelError: false };
        case ORDERS_HISTORY_CANCEL_DATA:
            return { ...state, cancelFetching: false, list: action.payload };
        case ORDERS_HISTORY_CANCEL_ERROR:
            return { ...state, cancelFetching: false, cancelError: true };
        case ORDERS_HISTORY_RESET: {
            return { ...state, list: [], pageIndex: 0, fetching: false };
        }
        default:
            return state;
    }
};
