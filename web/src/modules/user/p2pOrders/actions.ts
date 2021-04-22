import { CommonError } from "src/modules/types";
import {
    P2P_ORDERS_UPDATE_DATA,
    P2P_ORDERS_UPDATE_ERROR,
    P2P_ORDERS_UPDATE_FETCH,
    P2P_ORDERS_CREATE_DATA,
    P2P_ORDERS_CREATE_ERROR,
    P2P_ORDERS_CREATE_FETCH,
    P2P_TRADES_HISTORY_DATA,
    P2P_TRADES_HISTORY_ERROR,
    P2P_TRADES_HISTORY_FETCH,
    P2P_ORDER_DATA,
    P2P_ORDER_ERROR,
    P2P_ORDER_FETCH,
    P2P_ORDERS_UPDATE,
    P2P_ORDERS_APPEND,
    P2P_ORDER_RESET_SUCCESS,
    P2P_REMOVE_ORDER_ALERT,
} from "./constants";
import { P2POrderCreate, P2POrder } from "./types";

export interface P2POrdersCreateFetch {
    type: typeof P2P_ORDERS_CREATE_FETCH;
    payload: P2POrderCreate;
}

export interface P2POrdersCreateData {
    type: typeof P2P_ORDERS_CREATE_DATA;
    payload: P2POrder;
}

export interface P2POrdersCreateError {
    type: typeof P2P_ORDERS_CREATE_ERROR;
    error: CommonError;
}

export interface P2PTradesHistoryFetch {
    type: typeof P2P_TRADES_HISTORY_FETCH;
    payload: {
        page: number;
        limit: number;
        side?: string;
    };
}
export interface P2PTradesHistoryData {
    type: typeof P2P_TRADES_HISTORY_DATA;
    payload: {
        list: P2POrder[];
        page: number;
        total: number;
    }
}

export interface P2PTradesHistoryError {
    type: typeof P2P_TRADES_HISTORY_ERROR;
    error: CommonError;
}

export interface P2POrderFetch {
    type: typeof P2P_ORDER_FETCH;
    payload: {
        id: number;
    };
}

export interface P2POrderData {
    type: typeof P2P_ORDER_DATA;
    payload: P2POrder;
}

export interface P2POrderError {
    type: typeof P2P_ORDER_ERROR;
    error: CommonError;
}

export interface P2POrdersUpdateFetch {
    type: typeof P2P_ORDERS_UPDATE_FETCH;
    payload: {
        id: number;
        action: string;
        payment_method_id?: number;
    };
}

export interface P2POrdersUpdateData {
    type: typeof P2P_ORDERS_UPDATE_DATA;
    payload: P2POrder;
}

export interface P2POrdersUpdateError {
    type: typeof P2P_ORDERS_UPDATE_ERROR;
    error: CommonError;
}

export interface P2POrdersDataWS {
    type: typeof P2P_ORDERS_UPDATE;
    payload: P2POrder;
}

export interface P2POrdersAppend {
    type: typeof P2P_ORDERS_APPEND;
    payload: P2POrder;
}

export interface P2POrderResetSuccess {
    type: typeof P2P_ORDER_RESET_SUCCESS;
}

export interface P2POrderRemoveAlert {
    type: typeof P2P_REMOVE_ORDER_ALERT;
    payload: {
        list: P2POrder[];
    }
}

export type P2POrdersActions =
    P2POrdersCreateFetch
    | P2POrdersCreateData
    | P2POrdersCreateError
    | P2PTradesHistoryFetch
    | P2PTradesHistoryData
    | P2PTradesHistoryError
    | P2POrderFetch
    | P2POrderData
    | P2POrderError
    | P2POrdersUpdateFetch
    | P2POrdersUpdateData
    | P2POrdersUpdateError
    | P2POrdersDataWS
    | P2POrdersAppend
    | P2POrderResetSuccess
    | P2POrderRemoveAlert;

export const p2pOrdersCreateFetch = (payload: P2POrderCreate): P2POrdersCreateFetch => ({
    type: P2P_ORDERS_CREATE_FETCH,
    payload,
});

export const p2pOrdersCreateData = (payload: P2POrdersCreateData['payload']): P2POrdersCreateData => ({
    type: P2P_ORDERS_CREATE_DATA,
    payload,
});

export const p2pOrdersCreateError = (error: CommonError): P2POrdersCreateError => ({
    type: P2P_ORDERS_CREATE_ERROR,
    error,
});

export const p2pTradesHistoryFetch = (payload?: P2PTradesHistoryFetch['payload']): P2PTradesHistoryFetch => ({
    type: P2P_TRADES_HISTORY_FETCH,
    payload,
});

export const p2pTradesHistoryData = (payload: P2PTradesHistoryData['payload']): P2PTradesHistoryData => ({
    type: P2P_TRADES_HISTORY_DATA,
    payload,
});

export const p2pTradesHistoryError = (error: CommonError): P2PTradesHistoryError => ({
    type: P2P_TRADES_HISTORY_ERROR,
    error,
});

export const p2pOrderFetch = (payload: P2POrderFetch['payload']): P2POrderFetch => ({
    type: P2P_ORDER_FETCH,
    payload,
});

export const p2pOrderData = (payload: P2POrderData['payload']): P2POrderData => ({
    type: P2P_ORDER_DATA,
    payload,
});

export const p2pOrderError = (error: CommonError): P2POrderError => ({
    type: P2P_ORDER_ERROR,
    error,
});

export const p2pOrdersUpdateFetch = (payload: P2POrdersUpdateFetch['payload']): P2POrdersUpdateFetch => ({
    type: P2P_ORDERS_UPDATE_FETCH,
    payload,
});

export const p2pOrdersUpdateData = (payload: P2POrdersUpdateData['payload']): P2POrdersUpdateData => ({
    type: P2P_ORDERS_UPDATE_DATA,
    payload,
});

export const p2pOrdersUpdateError = (error: CommonError): P2POrdersUpdateError => ({
    type: P2P_ORDERS_UPDATE_ERROR,
    error,
});

export const p2pOrdersDataWS = (payload: P2POrdersDataWS['payload']): P2POrdersDataWS => ({
    type: P2P_ORDERS_UPDATE,
    payload,
});

export const p2pOrdersAppend = (payload: P2POrdersAppend['payload']): P2POrdersAppend => ({
    type: P2P_ORDERS_APPEND,
    payload,
});

export const p2pOrderResetSuccess = (): P2POrderResetSuccess => ({
    type: P2P_ORDER_RESET_SUCCESS,
});

export const p2pOrderRemoveAlert = (payload: P2POrderRemoveAlert['payload']): P2POrderRemoveAlert => ({
    type: P2P_REMOVE_ORDER_ALERT,
    payload,
});
