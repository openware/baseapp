import { CommonError, CommonState } from '../../../../modules/types';
import { IEOOrderAction } from './actions';
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

export interface OrderIEOState extends CommonState {
    cancel: {
        loading: boolean;
        success: boolean;
        error?: CommonError;
    };
    execute: {
        loading: boolean;
        success: boolean;
        data?: OrderIEOData;
        error?: CommonError;
    };
    fetch: {
        data: OrderIEOData[];
        loading: boolean;
        success: boolean;
        error?: CommonError;
    };
    history: {
        data: OrderIEOData[];
        total: number;
        page: number;
        loading: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialOrderIEOState: OrderIEOState = {
    cancel: {
        success: false,
        loading: false,
    },
    execute: {
        success: false,
        loading: false,
    },
    fetch: {
        success: false,
        data: [],
        loading: false,
    },
    history: {
        success: false,
        data: [],
        loading: false,
        total: 0,
        page: 0,
    },
};

const ieoOrderCancelReducer = (state: OrderIEOState['cancel'], action: IEOOrderAction) => {
    switch (action.type) {
        case IEO_ORDER_CANCEL_FETCH:
            return {
                ...state,
                success: false,
                loading: true,
            };
        case IEO_ORDER_CANCEL_DATA:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case IEO_ORDER_CANCEL_ERROR:
            return {
                ...state,
                success: false,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

const ieoOrderExecuteReducer = (state: OrderIEOState['execute'], action: IEOOrderAction) => {
    switch (action.type) {
        case IEO_ORDER_EXECUTE_FETCH:
            return {
                ...state,
                success: false,
                loading: true,
            };
        case IEO_ORDER_EXECUTE_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case IEO_ORDER_EXECUTE_ERROR:
            return {
                ...state,
                success: false,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

const ieoOrdersFetchReducer = (state: OrderIEOState['fetch'], action: IEOOrderAction) => {
    switch (action.type) {
        case IEO_ORDERS_FETCH:
            return {
                ...state,
                success: false,
                loading: true,
            };
        case IEO_ORDERS_DATA:
            return {
                ...state,
                success: true,
                loading: false,
                data: action.payload,
            };
        case IEO_ORDERS_ERROR:
            return {
                ...state,
                success: false,
                loading: false,
                error: action.payload,
                data: [],
            };
        case IEO_ORDERS_POP:
            if (state.data.length) {
                return {
                    ...state,
                    data: [...state.data.filter(order => order.id !== action.payload.id)],
                };
            }

            return state;
        case IEO_ORDERS_PUSH:
            return {
                ...state,
                success: true,
                loading: false,
                data: [action.payload, ...state.data],
            };
        default:
            return state;
    }
};

const ieoHistoryFetchReducer = (state: OrderIEOState['history'], action: IEOOrderAction) => {
    switch (action.type) {
        case IEO_HISTORY_FETCH:
            return {
                ...state,
                success: false,
                loading: true,
            };
        case IEO_HISTORY_DATA:
            return {
                ...state,
                success: true,
                loading: false,
                data: action.payload.list,
                total: action.payload.total,
                page: action.payload.page,
            };
        case IEO_HISTORY_ERROR:
            return {
                ...state,
                success: false,
                loading: false,
                error: action.payload,
                data: [],
                total: 0,
                page: 0,
            };
        default:
            return state;
    }
};

export const ieoOrderReducer = (state = initialOrderIEOState, action: IEOOrderAction) => {
    switch (action.type) {
        case IEO_ORDERS_FETCH:
        case IEO_ORDERS_DATA:
        case IEO_ORDERS_ERROR:
        case IEO_ORDERS_POP:
        case IEO_ORDERS_PUSH:
            const ieoOrdersFetchState = { ...state.fetch };

            return {
                ...state,
                fetch: ieoOrdersFetchReducer(ieoOrdersFetchState, action),
            };
        case IEO_ORDER_CANCEL_FETCH:
        case IEO_ORDER_CANCEL_DATA:
        case IEO_ORDER_CANCEL_ERROR:
            const ieoOrderCancelState = { ...state.cancel };

            return {
                ...state,
                cancel: ieoOrderCancelReducer(ieoOrderCancelState, action),
            };
        case IEO_ORDER_EXECUTE_FETCH:
        case IEO_ORDER_EXECUTE_DATA:
        case IEO_ORDER_EXECUTE_ERROR:
            const ieoOrderExecuteState = { ...state.execute };

            return {
                ...state,
                execute: ieoOrderExecuteReducer(ieoOrderExecuteState, action),
            };
        case IEO_HISTORY_FETCH:
        case IEO_HISTORY_DATA:
        case IEO_HISTORY_ERROR:
            const ieoHistoryFetchState = { ...state.history };

            return {
                ...state,
                history: ieoHistoryFetchReducer(ieoHistoryFetchState, action),
            };
        default:
            return state;
    }
};
