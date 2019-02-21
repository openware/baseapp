import { OrderCommon } from '../../types';
import { OpenOrdersAction } from './actions';
import {
    OPEN_ORDERS_APPEND,
    OPEN_ORDERS_CANCEL_DATA,
    OPEN_ORDERS_CANCEL_ERROR,
    OPEN_ORDERS_CANCEL_FETCH,
    OPEN_ORDERS_DATA,
    OPEN_ORDERS_ERROR,
    OPEN_ORDERS_FETCH,
    OPEN_ORDERS_RESET,
    OPEN_ORDERS_UPDATE,
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
        case OPEN_ORDERS_FETCH:
            return { ...state, fetching: true };
        case OPEN_ORDERS_DATA:
            return { ...state, fetching: false, list: action.payload.map(convertOrderAPI) };
        case OPEN_ORDERS_UPDATE:
            return { ...state, list: insertOrUpdate(state.list, convertOrderEvent(action.payload)) };
        case OPEN_ORDERS_ERROR:
            return { ...state, fetching: false, list: [] };
        case OPEN_ORDERS_APPEND:
            return { ...state, list: insertIfNotExisted(state.list, convertOrderAPI(action.payload)) };
        case OPEN_ORDERS_RESET:
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
