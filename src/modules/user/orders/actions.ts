import { CommonError, OrderSide } from '../../types';
import {
    ORDER_EXECUTE_DATA,
    ORDER_EXECUTE_ERROR,
    ORDER_EXECUTE_FETCH,
    ORDERS_SET_CURRENT_PRICE,
} from './constants';

export interface OrderExecution {
    market: string;
    side: OrderSide;
    volume: string;
    price?: string;
    ord_type?: string;
}

export interface OrderExecuteFetch {
    type: typeof ORDER_EXECUTE_FETCH;
    payload: OrderExecution;
}

export interface OrderExecuteData {
    type: typeof ORDER_EXECUTE_DATA;
}

export interface OrderExecuteError {
    type: typeof ORDER_EXECUTE_ERROR;
    payload: CommonError;
}

export interface SetCurrentPrice {
  type: typeof ORDERS_SET_CURRENT_PRICE;
  payload: number | undefined;
}

export type OrdersAction =
    OrderExecuteFetch
    | OrderExecuteData
    | OrderExecuteError
    | SetCurrentPrice;


export const orderExecuteFetch =
    (payload: OrderExecuteFetch['payload']): OrderExecuteFetch => ({
        type: ORDER_EXECUTE_FETCH,
        payload,
    });

export const orderExecuteData = (): OrderExecuteData => ({
    type: ORDER_EXECUTE_DATA,
});

export const orderExecuteError =
    (payload: OrderExecuteError['payload']): OrderExecuteError => ({
        type: ORDER_EXECUTE_ERROR,
        payload,
    });

export const setCurrentPrice =
  (payload: SetCurrentPrice['payload']): SetCurrentPrice => ({
    type: ORDERS_SET_CURRENT_PRICE,
    payload,
  });
