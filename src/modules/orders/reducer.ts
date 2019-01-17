import { CommonError, CommonState } from '../types';
import { OrdersAction } from './actions';
import {
    FEES_DATA,
    FEES_ERROR,
    FEES_FETCH,
    ORDER_CANCEL_DATA,
    ORDER_CANCEL_ERROR,
    ORDER_CANCEL_FETCH,
    ORDER_EXECUTE_DATA,
    ORDER_EXECUTE_ERROR,
    ORDER_EXECUTE_FETCH,
    ORDERS_DATA,
    ORDERS_ERROR,
    ORDERS_FETCH,
    USER_ORDERS_DATA,
    USER_ORDERS_ERROR,
    USER_ORDERS_FETCH,
} from './constants';
import {
    DefaultFee,
    GroupedOrders,
    MarketFees,
    Order,
} from './types';

export interface OrdersState extends CommonState {
    orders: GroupedOrders;
    fees: MarketFees[];
    feesLoading: boolean;
    cancelLoading: boolean;
    executeLoading: boolean;
    feesError?: CommonError;
    cancelError?: CommonError;
    executeError?: CommonError;
}

const defaultOrders: GroupedOrders = {
    wait: [],
    done: [],
    cancel: [],
};

const initialState: OrdersState = {
    loading: false,
    orders: defaultOrders,
    fees: [],
    feesLoading: false,
    cancelLoading: false,
    executeLoading: false,
};

const filterOrderById = (id: number | string) =>
    (order: Order): boolean => Number(id) !== Number(order.id);

const findOrderById = (id: number | string) =>
    (order: Order): boolean => Number(id) === Number(order.id);

const removeCancelledOrder = (source: GroupedOrders, id: string | number): GroupedOrders => {
    const cancelledOrder = source.wait.find(findOrderById(id));

    if (!cancelledOrder) {
        return source;
    }

    const updatedOrder: Order = {
        ...cancelledOrder,
        state: 'cancel',
        executed_volume: cancelledOrder.origin_volume,
        side: cancelledOrder.side || (cancelledOrder.kind === 'bid' ? 'buy' : 'sell'),
    };

    return {
        ...source,
        cancel: [updatedOrder, ...source.cancel],
        wait: source.wait.filter(filterOrderById(id)),
    };
};

const appendExecutedOrder = (source: GroupedOrders, order: Order): GroupedOrders => {
    return {
        ...source,
        wait: [order, ...source.wait],
    };
};

const getConvertedFees = (fees: DefaultFee[]): MarketFees[] =>
    fees.map(fee => ({
        [fee.market]: {
            ask: fee.ask_fee,
            bid: fee.bid_fee,
        },
    }));

export const ordersReducer = (state = initialState, action: OrdersAction) => {
    switch (action.type) {
        case USER_ORDERS_FETCH:
        case ORDERS_FETCH:
            return { ...state, loading: true };
        case USER_ORDERS_DATA:
        case ORDERS_DATA:
            return {
                ...state,
                loading: false,
                orders: action.payload,
            };
        case USER_ORDERS_ERROR:
        case ORDERS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case ORDER_CANCEL_FETCH:
            return {
                ...state,
                cancelLoading: true,
                cancelError: undefined,
            };
        case ORDER_CANCEL_DATA:
            return {
                ...state,
                orders: removeCancelledOrder(state.orders, action.payload.id),
                cancelLoading: false,
                cancelError: undefined,
            };
        case ORDER_CANCEL_ERROR:
            return {
                ...state,
                cancelLoading: false,
                cancelError: action.payload,
            };
        case ORDER_EXECUTE_FETCH:
            return {
                ...state,
                executeLoading: true,
                executeError: undefined,
            };
        case ORDER_EXECUTE_DATA:
            return {
                ...state,
                orders: appendExecutedOrder(state.orders, action.payload),
                executeLoading: false,
                executeError: undefined,
            };
        case ORDER_EXECUTE_ERROR:
            return {
                ...state,
                executeLoading: false,
                executeError: action.payload,
            };
        case FEES_FETCH:
            return {
                ...state,
                feesLoading: true,
                feesError: undefined,
            };
        case FEES_DATA:
            return {
                ...state,
                feesLoading: false,
                feesError: undefined,
                fees: getConvertedFees(action.payload),
            };
        case FEES_ERROR:
            return {
                ...state,
                feesLoading: false,
                feesError: action.payload,
            };
        default:
            return state;
    }
};
