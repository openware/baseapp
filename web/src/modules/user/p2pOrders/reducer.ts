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
};

const orderReducer = (state: P2POrdersState['order'], action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_ORDERS_CREATE_FETCH:
        case P2P_ORDER_FETCH:
        case P2P_ORDERS_UPDATE_FETCH:
            return {
                ...state,
                loading: true,
            };
        case P2P_ORDERS_CREATE_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
                success: true,
                error: undefined,
            };
        case P2P_ORDERS_CREATE_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        case P2P_ORDER_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: undefined,
            };
        case P2P_ORDERS_UPDATE_DATA:
            return {
                ...state,
                data: action.payload,
                updateSuccess: true,
                error: undefined,
            };
        case P2P_ORDERS_UPDATE_ERROR:
            return {
                ...state,
                updateSuccess: false,
                error: action.error,
            };
        case P2P_ORDER_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};

const p2pOrdersWebsocketReducer = (state: P2POrdersState, action: P2POrdersActions) => {
    switch (action.type) {
        case P2P_ORDERS_APPEND:
            return {
                ...state,
                list: sliceArray(insertIfNotExisted(state.tradesHistory.list, action.payload), defaultStorageLimit())
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

            return {
                ...state,
                tradesHistory: tradesHistoryState,
                order: orderState,
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
                fetching: true,
            };
        case P2P_TRADES_HISTORY_DATA:
            return {
                ...state,
                list: action.payload.list,
                page: action.payload.page,
                total: action.payload.total,
                fetching: false,
                success: true,
                error: undefined,
            };
        case P2P_TRADES_HISTORY_ERROR:
            return {
                ...state,
                list: [],
                page: 0,
                total: 0,
                fetching: false,
                success: false,
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
            return {
                ...p2pOrdersWebsocketReducer(state, action),
            };
        default:
            return state;
    }
};
