import { OrderCommon } from '../../types';
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
} from './constants';

export interface OrdersHistoryState {
    list: OrderCommon[];
    fetching: boolean;
    total: number;
    pageIndex: number;
    cancelAllFetching: boolean;
    cancelAllError: boolean;
    cancelError: boolean;
    cancelFetching: boolean;
}

export const initialOrdersHistoryState: OrdersHistoryState = {
    list: [],
    fetching: false,
    total: 0,
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
                total: action.payload.total,
            };
        case ORDERS_HISTORY_ERROR:
            return { ...state, list: [], total: 0, pageIndex: 0, fetching: false };
        case ORDERS_CANCEL_ALL_FETCH:
            return { ...state, cancelAllFetching: true, cancelAllError: false };
        case ORDERS_CANCEL_ALL_DATA:
            return { ...state, cancelAllFetching: false, list: action.payload };
        case ORDERS_CANCEL_ALL_ERROR:
            return { ...state, cancelAllFetching: false, cancelAllError: true };
        case ORDERS_HISTORY_CANCEL_FETCH:
            return { ...state, cancelFetching: true, cancelError: false };
        case ORDERS_HISTORY_CANCEL_DATA:
            return { ...state, cancelFetching: false, list: action.payload, total: state.total ? state.total - 1 : 0 };
        case ORDERS_HISTORY_CANCEL_ERROR:
            return { ...state, cancelFetching: false, cancelError: true };
        default:
            return state;
    }
};
