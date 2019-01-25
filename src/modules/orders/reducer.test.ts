import { Cryptobase, defaultStorageLimit } from '../../api';
import { Market } from '../markets';
import { feesData, feesError, feesFetch, orderCancelData, orderCancelError, orderCancelFetch, orderExecuteData, orderExecuteError, orderExecuteFetch, userOrdersData, userOrdersError, userOrdersFetch, userOrdersUpdate } from './actions';
import { ordersReducer } from './reducer';
import { OrderSide, OrderStatus } from './types';

describe('Orders reducer', () => {
    const markets: Market[] = [
        {
            id: 'btceur',
            name: 'BTC/EUR',
        },
        {
            id: 'ethzar',
            name: 'ETH/ZAR',
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
                fees: [],
                feesLoading: false,
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
                fees: [],
                feesLoading: false,
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
            fees: [],
            feesLoading: false,
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
                fees: [],
                feesLoading: false,
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
            fees: [],
            feesLoading: false,
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
                fees: [],
                feesLoading: false,
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
            fees: [],
            feesLoading: false,
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
                fees: [],
                feesLoading: false,
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
                fees: [],
                feesLoading: false,
                cancelLoading: false,
                executeLoading: false,
                error: someError,
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
                fees: [],
                feesLoading: false,
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
            fees: [],
            feesLoading: false,
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
                fees: [],
                feesLoading: false,
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
                fees: [],
                feesLoading: false,
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
                fees: [],
                feesLoading: false,
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
                fees: [],
                feesLoading: false,
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
                fees: [],
                feesLoading: false,
                cancelLoading: false,
                executeLoading: false,
                executeError: someError,
            });
    });

    it('supports feesFetch', () => {
        expect(ordersReducer(undefined, feesFetch()))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                fees: [],
                feesLoading: true,
                feesError: undefined,
                cancelLoading: false,
                executeLoading: false,
            });
    });

    it('supports feesData', () => {
        const fees = [
            {
                market: 'bchbtc',
                ask_fee: {
                    type: 'relative',
                    value: '0.0001',
                },
                bid_fee: {
                    type: 'relative',
                    value: '0.0001',
                },
            },
            {
                market: 'ethbtc',
                ask_fee: {
                    type: 'relative',
                    value: '0.0002',
                },
                bid_fee: {
                    type: 'relative',
                    value: '0.0003',
                },
            },
        ];
        expect(ordersReducer(undefined, feesData(fees)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                fees: [
                    {
                        bchbtc: {
                            ask: {
                                type: 'relative',
                                value: '0.0001',
                            },
                            bid: {
                                type: 'relative',
                                value: '0.0001',
                            },
                        },
                    },
                    {
                        ethbtc: {
                            ask: {
                                type: 'relative',
                                value: '0.0002',
                            },
                            bid: {
                                type: 'relative',
                                value: '0.0003',
                            },
                        },
                    },
                ],
                feesLoading: false,
                feesError: undefined,
                cancelLoading: false,
                executeLoading: false,
            });
    });

    it('supports feesError', () => {
        expect(ordersReducer(undefined, feesError(someError)))
            .toEqual({
                loading: false,
                orders: {
                    wait: [],
                    done: [],
                    cancel: [],
                },
                fees: [],
                feesLoading: false,
                feesError: someError,
                cancelLoading: false,
                executeLoading: false,
            });
    });

});
