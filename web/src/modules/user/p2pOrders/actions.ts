import { CommonError } from "src/modules/types";
import {
    P2P_ORDERS_CREATE_DATA,
    P2P_ORDERS_CREATE_ERROR,
    P2P_ORDERS_CREATE_FETCH,
    P2P_TRADES_HISTORY_DATA,
    P2P_TRADES_HISTORY_ERROR,
    P2P_TRADES_HISTORY_FETCH,
} from "./constants";
import { P2POrderCreate, P2POrder, P2PTradesHistory } from "./types";

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
        list: P2PTradesHistory[];
        page: number;
        total: number;
    }
}

export interface P2PTradesHistoryError {
    type: typeof P2P_TRADES_HISTORY_ERROR;
    error: CommonError;
}

export type P2POrdersActions =
    P2POrdersCreateFetch
    | P2POrdersCreateData
    | P2POrdersCreateError
    | P2PTradesHistoryFetch
    | P2PTradesHistoryData
    | P2PTradesHistoryError;

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
