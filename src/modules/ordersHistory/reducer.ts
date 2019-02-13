import { Order } from '../orders';
import { OrdersHistoryAction } from './actions';
import {
    USER_ORDERS_HISTORY_DATA,
    USER_ORDERS_HISTORY_ERROR,
    USER_ORDERS_HISTORY_FETCH,
} from './constants';


export interface OrdersHistoryState {
    list: Order[];
    fetching: boolean;
    total: number;
    pageIndex: number;
}

export const initialOrdersHistoryState: OrdersHistoryState = {
    list: [],
    fetching: false,
    total: 0,
    pageIndex: 0,
};


export const ordersHistoryReducer = (state = initialOrdersHistoryState, action: OrdersHistoryAction): OrdersHistoryState => {
    switch (action.type) {
        case USER_ORDERS_HISTORY_FETCH:
            return { ...state, fetching: true };
        case USER_ORDERS_HISTORY_DATA:
            return {
                ...state,
                list: action.payload.list,
                fetching: false,
                pageIndex: action.payload.pageIndex,
                total: action.payload.total,
            };
        case USER_ORDERS_HISTORY_ERROR: {
            return { ...state, list: [], total: 0, pageIndex: 0, fetching: false };
        }
        default:
            return state;
    }
};
