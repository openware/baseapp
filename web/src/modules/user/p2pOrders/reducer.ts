import { defaultStorageLimit } from "src/api";
import { sliceArray } from "src/helpers";
import { CommonError } from "src/modules/types";
import { insertIfNotExisted, insertOrUpdate } from "./helpers";
import { P2POrdersActions } from "./actions";
import {
    P2P_ORDER_DATA,
    P2P_ORDER_ERROR,
    P2P_ORDER_FETCH,
    P2P_ORDERS_UPDATE_DATA,
    P2P_ORDERS_UPDATE_ERROR,
    P2P_ORDERS_UPDATE_FETCH,
    P2P_ORDERS_CREATE_DATA,
    P2P_ORDERS_CREATE_ERROR,
    P2P_ORDERS_CREATE_FETCH,
    P2P_TRADES_HISTORY_DATA,
    P2P_TRADES_HISTORY_ERROR,
    P2P_TRADES_HISTORY_FETCH,
    P2P_ORDERS_UPDATE,
    P2P_ORDERS_APPEND,
    P2P_ORDER_RESET_SUCCESS,
    P2P_REMOVE_ORDER_ALERT,
} from "./constants";
import { P2POrder } from "./types";

export interface P2POrdersState {
    order: {
        data: P2POrder;
        loading: boolean;
        success: boolean;
        error?: CommonError;
        updateSuccess: boolean;
    };
    tradesHistory: {
        page: number;
        total: number;
        list: P2POrder[];
       
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    alertList: {
        list: P2POrder[];
    };
}

export const initialP2POrdersState: P2POrdersState = {
    order: {
        data: null,
        loading: false,
        success: false,
        updateSuccess: false,
    },
    tradesHistory: {
        page: 0,
        total: 0,
        list: [],
        fetching: false,
        success: false,
    },
    alertList: {
        list: [],
    },
};

const orderReducer = (state: P2POrdersState['order'], action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_ORDERS_CREATE_FETCH:
        case P2P_ORDER_FETCH:
        case P2P_ORDERS_UPDATE_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
                success: false,
                updateSuccess: false,
                data: undefined,
            };
        case P2P_ORDERS_CREATE_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
                success: true,
            };
        case P2P_ORDERS_CREATE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case P2P_ORDER_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        case P2P_ORDERS_UPDATE_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
                updateSuccess: true,
            };
        case P2P_ORDERS_UPDATE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case P2P_ORDER_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case P2P_ORDER_RESET_SUCCESS:
            return {
                ...state,
                success: false,
            };
        default:
            return state;
    }
};

const p2pOrdersWebsocketReducer = (state: P2POrdersState, action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_ORDERS_APPEND:
            const tradesHistoryAppendState = {
                ...state.tradesHistory,
                list: sliceArray(insertIfNotExisted(state.tradesHistory.list, action.payload), defaultStorageLimit())
            };

            return {
                ...state,
                tradesHistory: tradesHistoryAppendState,
            };
        case P2P_ORDERS_UPDATE:
            let orderState = { ...state.order };

            if (state.order.data && action.payload.id === state.order.data.id) {
                orderState = {
                    ...state.order,
                    data: action.payload,
                    loading: false,
                };
            }

            const tradesHistoryState = {
                ...state.tradesHistory,
                list: sliceArray(insertOrUpdate(state.tradesHistory.list, action.payload), defaultStorageLimit()),
            };

            const alertListState = {
                ...state.alertList,
                list: sliceArray(insertOrUpdate(state.alertList.list, action.payload), defaultStorageLimit()),
            };

            return {
                ...state,
                tradesHistory: tradesHistoryState,
                order: orderState,
                alertList: alertListState,
            };
        case P2P_REMOVE_ORDER_ALERT:
            return {
                ...state,
                alertList: action.payload,
            };
        default:
            return state;
    }
};

const tradesHistoryReducer = (state: P2POrdersState['tradesHistory'], action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_TRADES_HISTORY_FETCH:
            return {
                ...state,
                page: action.payload.page,
                list: [],
                fetching: true,
                error: undefined,
                success: false,
            };
        case P2P_TRADES_HISTORY_DATA:
            return {
                ...state,
                list: action.payload.list,
                total: action.payload.total,
                fetching: false,
                success: true,
            };
        case P2P_TRADES_HISTORY_ERROR:
            return {
                ...state,
                page: 0,
                total: 0,
                fetching: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const p2pOrdersReducer = (state = initialP2POrdersState, action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_ORDERS_CREATE_FETCH:
        case P2P_ORDERS_CREATE_DATA:
        case P2P_ORDERS_CREATE_ERROR:
        case P2P_ORDER_FETCH:
        case P2P_ORDER_DATA:
        case P2P_ORDER_ERROR:
        case P2P_ORDERS_UPDATE_FETCH:
        case P2P_ORDERS_UPDATE_DATA:
        case P2P_ORDERS_UPDATE_ERROR:
        case P2P_ORDER_RESET_SUCCESS:
            const orderState = { ...state.order };

            return {
                ...state,
                order: orderReducer(orderState, action),
            };
        case P2P_TRADES_HISTORY_FETCH:
        case P2P_TRADES_HISTORY_DATA:
        case P2P_TRADES_HISTORY_ERROR:
            const tradesHistoryState = { ...state.tradesHistory };

            return {
                ...state,
                tradesHistory: tradesHistoryReducer(tradesHistoryState, action),
            };
        case P2P_ORDERS_UPDATE:
        case P2P_ORDERS_APPEND:
        case P2P_REMOVE_ORDER_ALERT:
            return {
                ...p2pOrdersWebsocketReducer(state, action),
            };
        default:
            return state;
    }
};
