import { OrderCommon } from '../types';
import { OpenOrdersAction } from './actions';
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
import { convertOrderAPI, convertOrderEvent, insertIfNotExisted, insertOrUpdate } from './helpers';

export interface OpenOrdersState {
    fetching: boolean;
    list: OrderCommon[];
    cancelFetching: boolean;
    cancelError: boolean;
}

export const initialOpenOrdersState: OpenOrdersState = {
    fetching: false,
    list: [],
    cancelFetching: false,
    cancelError: false,
};

export const openOrdersReducer = (
    state: OpenOrdersState = initialOpenOrdersState,
    action: OpenOrdersAction,
): OpenOrdersState => {
    switch (action.type) {
        case USER_OPEN_ORDERS_FETCH:
            return { ...state, fetching: true };
        case USER_OPEN_ORDERS_DATA:
            return { ...state, fetching: false, list: action.payload.map(convertOrderAPI) };
        case USER_OPEN_ORDERS_UPDATE:
            return { ...state, list: insertOrUpdate(state.list, convertOrderEvent(action.payload)) };
        case USER_OPEN_ORDERS_ERROR:
            return { ...state, fetching: false, list: [] };
        case USER_OPEN_ORDERS_APPEND:
            return { ...state, list: insertIfNotExisted(state.list, action.payload) };
        case USER_OPEN_ORDERS_RESET:
            return initialOpenOrdersState;
        case OPEN_ORDERS_CANCEL_FETCH:
            return { ...state, cancelFetching: true, cancelError: false };
        case OPEN_ORDERS_CANCEL_DATA:
            return { ...state, cancelFetching: false, list: action.payload };
        case OPEN_ORDERS_CANCEL_ERROR:
            return { ...state, cancelFetching: false, cancelError: true };
        default:
            return state;
    }
};
