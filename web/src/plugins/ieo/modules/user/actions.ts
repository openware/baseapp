import { CommonError } from '../../../../modules/types';
import {
    IEO_HISTORY_DATA,
    IEO_HISTORY_ERROR,
    IEO_HISTORY_FETCH,
    IEO_ORDER_CANCEL_DATA,
    IEO_ORDER_CANCEL_ERROR,
    IEO_ORDER_CANCEL_FETCH,
    IEO_ORDER_EXECUTE_DATA,
    IEO_ORDER_EXECUTE_ERROR,
    IEO_ORDER_EXECUTE_FETCH,
    IEO_ORDERS_DATA,
    IEO_ORDERS_ERROR,
    IEO_ORDERS_FETCH,
    IEO_ORDERS_POP,
    IEO_ORDERS_PUSH,
} from './constants';
import { OrderIEOData } from './types';

export interface OrderIEOCancelFetch {
    type: typeof IEO_ORDER_CANCEL_FETCH;
    payload: {
        id: string | number;
    };
}

export interface OrderIEOCancelData {
    type: typeof IEO_ORDER_CANCEL_DATA;
    payload: OrderIEOData;
}

export interface OrderIEOCancelError {
    type: typeof IEO_ORDER_CANCEL_ERROR;
    payload: CommonError;
}

export interface OrderIEOExecution {
    sale: number;
    quote_unit: string;
    contribution: number;
}

export interface OrderIEOExecuteFetch {
    type: typeof IEO_ORDER_EXECUTE_FETCH;
    payload: OrderIEOExecution;
}

export interface OrderIEOExecuteData {
    type: typeof IEO_ORDER_EXECUTE_DATA;
    payload: OrderIEOData;
}

export interface OrderIEOExecuteError {
    type: typeof IEO_ORDER_EXECUTE_ERROR;
    payload: CommonError;
}

export interface OrdersIEOFetch {
    type: typeof IEO_ORDERS_FETCH;
    payload?: {
        state?: string;
        sale?: number;
        quote_unit?: string;
    };
}

export interface OrdersIEOData {
    type: typeof IEO_ORDERS_DATA;
    payload: OrderIEOData[];
}

export interface OrdersIEOError {
    type: typeof IEO_ORDERS_ERROR;
    payload: CommonError;
}

export interface OrdersIEOPop {
    type: typeof IEO_ORDERS_POP;
    payload: OrderIEOData;
}

export interface OrdersIEOPush {
    type: typeof IEO_ORDERS_PUSH;
    payload: OrderIEOData;
}


export interface HistoryIEOFetch {
    type: typeof IEO_HISTORY_FETCH;
    payload: {
        state?: string;
        page: number;
        limit: number;
    };
}

export interface HistoryIEOData {
    type: typeof IEO_HISTORY_DATA;
    payload: {
        list: OrderIEOData[];
        total: number;
        page: number;
    };
}

export interface HistoryIEOError {
    type: typeof IEO_HISTORY_ERROR;
    payload: CommonError;
}

export type IEOOrderAction =
    OrderIEOCancelFetch
    | OrderIEOCancelData
    | OrderIEOCancelError
    | OrderIEOExecuteFetch
    | OrderIEOExecuteData
    | OrderIEOExecuteError
    | OrdersIEOFetch
    | OrdersIEOData
    | OrdersIEOError
    | HistoryIEOData
    | HistoryIEOFetch
    | HistoryIEOError
    | OrdersIEOPop
    | OrdersIEOPush;

export const ieoOrdersFetch = (payload?: OrdersIEOFetch['payload']): OrdersIEOFetch => ({
    type: IEO_ORDERS_FETCH,
    payload,
});

export const ieoOrdersData = (payload: OrdersIEOData['payload']): OrdersIEOData => ({
    type: IEO_ORDERS_DATA,
    payload,
});

export const ieoOrdersError = (payload: OrdersIEOError['payload']): OrdersIEOError => ({
    type: IEO_ORDERS_ERROR,
    payload,
});

export const ieoOrdersPop = (payload: OrdersIEOPop['payload']): OrdersIEOPop => ({
    type: IEO_ORDERS_POP,
    payload,
});

export const ieoOrdersPush = (payload: OrdersIEOPush['payload']): OrdersIEOPush => ({
    type: IEO_ORDERS_PUSH,
    payload,
});

export const ieoOrderExecuteFetch = (payload: OrderIEOExecuteFetch['payload']): OrderIEOExecuteFetch => ({
    type: IEO_ORDER_EXECUTE_FETCH,
    payload,
});

export const ieoOrderExecuteData = (payload: OrderIEOExecuteData['payload']): OrderIEOExecuteData => ({
    type: IEO_ORDER_EXECUTE_DATA,
    payload,
});

export const ieoOrderExecuteError = (payload: OrderIEOExecuteError['payload']): OrderIEOExecuteError => ({
    type: IEO_ORDER_EXECUTE_ERROR,
    payload,
});

export const ieoOrderCancel = (payload: OrderIEOCancelFetch['payload']): OrderIEOCancelFetch => ({
    type: IEO_ORDER_CANCEL_FETCH,
    payload,
});

export const ieoOrderCancelData = (payload: OrderIEOCancelData['payload']): OrderIEOCancelData => ({
    type: IEO_ORDER_CANCEL_DATA,
    payload,
});

export const ieoOrderCancelError = (payload: OrderIEOCancelError['payload']): OrderIEOCancelError => ({
    type: IEO_ORDER_CANCEL_ERROR,
    payload,
});

export const ieoHistoryFetch = (payload: HistoryIEOFetch['payload']): HistoryIEOFetch => ({
    type: IEO_HISTORY_FETCH,
    payload,
});

export const ieoHistoryData = (payload: HistoryIEOData['payload']): HistoryIEOData => ({
    type: IEO_HISTORY_DATA,
    payload,
});

export const ieoHistoryError = (payload: HistoryIEOError['payload']): HistoryIEOError => ({
    type: IEO_HISTORY_ERROR,
    payload,
});
