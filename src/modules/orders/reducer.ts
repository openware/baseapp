import { defaultStorageLimit } from '../../api';
import { CommonError, CommonState } from '../types';
import { OrdersAction } from './actions';
import {
    ORDER_CANCEL_DATA,
    ORDER_CANCEL_ERROR,
    ORDER_CANCEL_FETCH,
    ORDER_EXECUTE_DATA,
    ORDER_EXECUTE_ERROR,
    ORDER_EXECUTE_FETCH,
    ORDERS_CANCEL_ALL_DATA,
    ORDERS_CANCEL_ALL_ERROR,
    ORDERS_CANCEL_ALL_FETCH,
    USER_ORDERS_DATA,
    USER_ORDERS_ERROR,
    USER_ORDERS_FETCH,
    USER_ORDERS_UPDATE,
} from './constants';
import {
    GroupedOrders,
    Order,
    OrderStatus,
} from './types';

export interface OrdersState extends CommonState {
    orders: GroupedOrders;
    cancelLoading: boolean;
    executeLoading: boolean;
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
    cancelLoading: false,
    executeLoading: false,
};

const filterOrderById = (id: number | string) =>
    (order: Order): boolean => Number(id) !== Number(order.id);

const findOrderById = (id: number | string) =>
    (order: Order): boolean => Number(id) === Number(order.id);

const removeCancelledOrders = (source: GroupedOrders): GroupedOrders => {
    const cancelledOrders = source.wait;

    if (!cancelledOrders) {
        return source;
    }

    const updatedOrders: Order[] = cancelledOrders.map(order => {
        order.state = 'cancel';
        order.executed_volume = order.origin_volume;
        order.side = order.side || (order.kind === 'bid' ? 'buy' : 'sell');
        return order;
    });

    return {
        ...source,
        cancel: updatedOrders,
        wait: source.wait,
    };
};

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

const userOrdersUpdate = (source: GroupedOrders, order: Order, state: OrderStatus): Order[] => {
    const orderToUpdate = source[state].find(findOrderById(order.id));
    if ((orderToUpdate) && (orderToUpdate.state === order.state)) {
        return [order, ...source[state].filter(filterOrderById(order.id))];
    }
    if (order.state === state) {
        return [order, ...source[state]];
    }
    if ((orderToUpdate) && (orderToUpdate.state === state)) {
        return source[state].filter(filterOrderById(orderToUpdate.id));
    }
    return [...source[state]];
};

export const ordersReducer = (state = initialState, action: OrdersAction) => {
    switch (action.type) {
        case USER_ORDERS_FETCH:
            return { ...state, loading: true };
        case USER_ORDERS_DATA:
            return {
                ...state,
                loading: false,
                orders: action.payload,
            };
        case USER_ORDERS_UPDATE:
            return {
                ...state,
                orders: {
                    cancel: userOrdersUpdate(state.orders, action.payload, 'cancel').slice(0, defaultStorageLimit()),
                    done: userOrdersUpdate(state.orders, action.payload, 'done').slice(0, defaultStorageLimit()),
                    wait: userOrdersUpdate(state.orders, action.payload, 'wait').slice(0, defaultStorageLimit()),
                },
                loading: false,
            };
        case USER_ORDERS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case ORDERS_CANCEL_ALL_FETCH:
            return {
                ...state,
                cancelLoading: true,
                cancelError: undefined,
            };
        case ORDERS_CANCEL_ALL_DATA:
            return {
                ...state,
                orders: removeCancelledOrders(state.orders),
                cancelLoading: false,
                cancelError: undefined,
            };
        case ORDERS_CANCEL_ALL_ERROR:
            return {
                ...state,
                cancelLoading: false,
                cancelError: action.payload,
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

        default:
            return state;
    }
};
