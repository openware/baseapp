import { Cryptobase, defaultStorageLimit } from '../../api';
import { Market } from '../markets';
import {
    orderCancelData,
    orderCancelError,
    orderCancelFetch,
    orderExecuteData,
    orderExecuteError,
    orderExecuteFetch,
    ordersCancelAllData,
    ordersCancelAllError,
    ordersCancelAllFetch,
    userOrdersData,
    userOrdersError,
    userOrdersFetch,
    userOrdersUpdate,
} from './actions';
import { ordersReducer } from './reducer';
import { OrderSide, OrderStatus } from './types';

describe('Orders reducer', () => {
    const markets: Market[] = [
        {
            id: 'ethusd',
            name: 'ETH/USD',
            ask_unit: 'eth',
            bid_unit: 'usd',
            ask_fee: '0.0015',
            bid_fee: '0.0015',
            min_ask_price: '0.0',
            max_bid_price: '0.0',
            min_ask_amount: '0.0',
            min_bid_amount: '0.0',
            ask_precision: 4,
            bid_precision: 4,
        },
        {
            id: 'trsteth',
            name: 'TRST/ETH',
            ask_unit: 'trst',
            bid_unit: 'eth',
            ask_fee: '0.0015',
            bid_fee: '0.0015',
            min_ask_price: '0.0',
            max_bid_price: '0.0',
            min_ask_amount: '0.0',
            min_bid_amount: '0.0',
            ask_precision: 4,
            bid_precision: 4,
        },
    ];

    const buy: OrderSide = 'buy';
    const wait: OrderStatus = 'wait';
    const done: OrderStatus = 'done';
    const cancel: OrderStatus = 'cancel';

    const cancelOrders = [
        {
            id: 1,
            side: buy,
            ord_type: 'limit',
            price: 0.001,
            avg_price: '0.0',
            state: cancel,
            market: 'bchbtc',
            created_at: '2018-12-20T15:38:38+01:00',
            volume: '0.1',
            remaining_volume: '0.1',
            executed_volume: '0.0',
            trades_count: 0,
        },
    ];

    const waitOrders = [
        {
            id: 2,
            side: buy,
            ord_type: 'limit',
            price: 0.001,
            avg_price: '0.0',
            state: wait,
            market: 'bchbtc',
            created_at: '2018-12-21T15:38:38+01:00',
            volume: '0.1',
            remaining_volume: '0.1',
            executed_volume: '0.0',
            trades_count: 0,
        },
    ];

    const doneOrders = [
        {
            id: 3,
            side: buy,
            ord_type: 'limit',
            price: 0.001,
            avg_price: '0.0',
            state: done,
            market: 'bchbtc',
            created_at: '2018-12-22T15:38:38+01:00',
            volume: '0.1',
            remaining_volume: '0.1',
            executed_volume: '0.0',
            trades_count: 0,
        },
    ];

    const someError = {
        code: 51,
        message: 'something went wrong',
    };

    it('supports initial userOrdersFetch', () => {
        expect(ordersReducer(undefined, userOrdersFetch(markets)))
            .toEqual({
                loading: true,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                executeLoading: false,
            });
    });

    it('supports userOrdersData', () => {
        expect(ordersReducer(undefined, userOrdersData({
            wait: waitOrders,
            done: doneOrders,
            cancel: cancelOrders,
        })))
            .toEqual({
                loading: false,
                orders: {
                    wait: waitOrders,
                    done: doneOrders,
                    cancel: cancelOrders,
                },

                cancelLoading: false,
                executeLoading: false,
            });
    });

    it('supports userOrdersUpdate when state changes', () => {
        const initialState = {
            loading: false,
            orders: {
                wait: waitOrders,
                done: [],
                cancel: cancelOrders,
            },
            cancelLoading: false,
            executeLoading: false,
        };

        const updatedOrder = {
            ...waitOrders[0],
            state: done,
        };

        expect(ordersReducer(initialState, userOrdersUpdate(updatedOrder)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [updatedOrder],
                    cancel: cancelOrders,
                },
                cancelLoading: false,
                executeLoading: false,
            });
    });

    it('supports userOrdersUpdate when a field changes', () => {
        const initialState = {
            loading: false,
            orders: {
                wait: waitOrders,
                done: [],
                cancel: [],
            },
            cancelLoading: false,
            executeLoading: false,
        };

        const updatedOrder = {
            ...waitOrders[0],
            remaining_volume: '0.05',
        };

        expect(ordersReducer(initialState, userOrdersUpdate(updatedOrder)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [updatedOrder],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                executeLoading: false,
            });
    });

    it('supports userOrdersUpdate to limit store size', () => {
        const orders = [
            {
                ...waitOrders[0],
                id: 2,
            },
            {
                ...waitOrders[0],
                id: 1,
            },
        ];
        const initialState = {
            loading: false,
            orders: {
                wait: orders,
                done: [],
                cancel: [],
            },
            cancelLoading: false,
            executeLoading: false,
        };

        const updatedOrder = {
            ...waitOrders[0],
            id: 3,
            remaining_volume: '0.05',
        };

        const initialLimit = defaultStorageLimit();
        Cryptobase.config.storage.defaultStorageLimit = 2;

        expect(ordersReducer(initialState, userOrdersUpdate(updatedOrder)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [
                        updatedOrder,
                        {
                            ...waitOrders[0],
                            id: 2,
                        },
                    ],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                executeLoading: false,
            });
        Cryptobase.config.storage.defaultStorageLimit = initialLimit;
    });

    it('supports userOrdersError', () => {
        expect(ordersReducer(undefined, userOrdersError(someError)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                executeLoading: false,
                error: someError,
            });
    });

    it('supports orderCancelAllFetch', () => {
        expect(ordersReducer(undefined, ordersCancelAllFetch()))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: true,
                cancelError: undefined,
                executeLoading: false,
            });
    });

    it('supports orderCancelAllData', () => {
        const initialState = {
            loading: false,
            orders: {
                wait: [],
                done: [],
                cancel: [],
            },
            cancelLoading: false,
            executeLoading: false,
        };
        expect(ordersReducer(initialState, ordersCancelAllData()))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                cancelError: undefined,
                executeLoading: false,
            });
    });

    it('supports orderCancelAllError', () => {
        expect(ordersReducer(undefined, ordersCancelAllError(someError)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                cancelError: someError,
                executeLoading: false,
            });
    });

    it('supports orderCancelFetch', () => {
        expect(ordersReducer(undefined, orderCancelFetch({ id: 12 })))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: true,
                cancelError: undefined,
                executeLoading: false,
            });
    });

    it('supports orderCancelData', () => {
        const initialState = {
            loading: false,
            orders: {
                wait: waitOrders,
                done: [],
                cancel: [],
            },
            cancelLoading: false,
            executeLoading: false,
        };
        expect(ordersReducer(initialState, orderCancelData({ id: 2 })))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [{
                        ...waitOrders[0],
                        state: 'cancel',
                        executed_volume: undefined,
                    }],
                },
                cancelLoading: false,
                cancelError: undefined,
                executeLoading: false,
            });
    });

    it('supports orderCancelError', () => {
        expect(ordersReducer(undefined, orderCancelError(someError)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                cancelError: someError,
                executeLoading: false,
            });
    });

    it('supports orderExecuteFetch', () => {
        const orderExecution = {
            market: 'ethbtc',
            side: buy,
            volume: '10',
            price: '0.01',
        };
        expect(ordersReducer(undefined, orderExecuteFetch(orderExecution)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                executeLoading: true,
                executeError: undefined,
            });
    });

    it('supports orderExecuteData', () => {
        expect(ordersReducer(undefined, orderExecuteData(waitOrders[0])))
            .toEqual({
                loading: false,
                orders: {
                    wait: waitOrders,
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                executeLoading: false,
                executeError: undefined,
            });
    });

    it('supports orderExecuteError', () => {
        expect(ordersReducer(undefined, orderExecuteError(someError)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                cancelLoading: false,
                executeLoading: false,
                executeError: someError,
            });
    });

});
