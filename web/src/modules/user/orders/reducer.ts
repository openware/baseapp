import { CommonError, CommonState } from '../../types';
import { OrdersAction } from './actions';
import {
    ORDERS_SET_AMOUNT,
    ORDERS_SET_CURRENT_PRICE,
    ORDERS_SET_ORDER_TYPE,
    ORDER_EXECUTE_DATA,
    ORDER_EXECUTE_ERROR,
    ORDER_EXECUTE_FETCH,
} from './constants';

export interface OrdersState extends CommonState {
    executeLoading: boolean;
    executeError?: CommonError;
    currentPrice: number | undefined;
    amount: string;
    orderType: string;
}

const initialState: OrdersState = {
    executeLoading: false,
    currentPrice: undefined,
    amount: '',
    orderType: '',
};

export const ordersReducer = (state = initialState, action: OrdersAction) => {
    switch (action.type) {
        case ORDER_EXECUTE_FETCH:
            return {
                ...state,
                executeLoading: true,
                executeError: undefined,
            };
        case ORDER_EXECUTE_DATA:
            return {
                ...state,
                executeLoading: false,
                executeError: undefined,
            };
        case ORDER_EXECUTE_ERROR:
            return {
                ...state,
                executeLoading: false,
                executeError: action.error,
            };
        case ORDERS_SET_CURRENT_PRICE:
            return {
                ...state,
                currentPrice: action.payload,
            };
        case ORDERS_SET_AMOUNT:
            return {
                ...state,
                amount: action.payload,
            };
        case ORDERS_SET_ORDER_TYPE:
            return {
                ...state,
                orderType: action.payload,
            };
        default:
            return state;
    }
};
