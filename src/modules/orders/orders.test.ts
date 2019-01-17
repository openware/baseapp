import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '..';
import {
    mockNetworkError,
    setupMockAxios,
    setupMockStore,
} from '../../helpers/jest';
import {
    feesFetch,
    orderCancelFetch,
    orderExecuteFetch,
    ordersFetch,
    userOrdersFetch,
} from './';
import { OrderExecution } from './actions';

// tslint:disable no-any no-magic-numbers
const debug = false;

describe('Orders', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    const market = 'bchbtc';

    const cancelOrders = [
      {
        id: 204099,
        side: 'buy',
        ord_type: 'limit',
        price: '0.001',
        avg_price: '0.0',
        state: 'cancel',
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
          id: 204099,
          side: 'buy',
          ord_type: 'limit',
          price: '0.001',
          avg_price: '0.0',
          state: 'wait',
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
          id: 204099,
          side: 'buy',
          ord_type: 'limit',
          price: '0.001',
          avg_price: '0.0',
          state: 'done',
          market: 'bchbtc',
          created_at: '2018-12-22T15:38:38+01:00',
          volume: '0.1',
          remaining_volume: '0.1',
          executed_volume: '0.0',
          trades_count: 0,
        },
    ];

    const orderCancel = {
        id: 'bchbtc',
    };

    const fees = [
        {
            ask_fee: '0.1',
            bid_fee: '0.2',
            market: 'bchbtc',
        },
        {
            ask_fee: '0.14',
            bid_fee: '0.12',
            market: 'xrpbch',
        },
    ];

    const executedOrder = {
        id: 204099,
        side: 'buy',
        ord_type: 'limit',
        price: '0.001',
        avg_price: '0.0',
        state: 'done',
        market: 'bchbtc',
        created_at: '2018-12-22T15:38:38+01:00',
        volume: '0.1',
        remaining_volume: '0.1',
        executed_volume: '0.0',
        trades_count: 0,
    };

    const orderCancelError = {
        error: {
            code: 500,
            message: 'Cannot cancel order',
        },
    };

    const unverifiedAccountResponse = {
        error: {
            code: 2000,
            message: 'Please, pass the corresponding verification steps to enable trading.',
        },
    };

    const orderExecuteError = {
        error: {
            code: 500,
            message: 'Cannot execute order',
        },
    };

    const feesError = {
        error: {
            code: 500,
            message: 'Cannot fetch fees',
        },
    };

    const userOrdersError = {
        error: {
            code: 500,
            message: 'Cannot fetch orders',
        },
    };

    const mockOrders = () => {
        mockAxios.onGet('/market/orders?market=bchbtc&state=cancel').reply(200, cancelOrders);
        mockAxios.onGet('/market/orders?market=bchbtc&state=done').reply(200, doneOrders);
        mockAxios.onGet('/market/orders?market=bchbtc&state=wait').reply(200, waitOrders);
    };

    const mockUserOrders = () => {
        mockAxios.onGet('/market/orders?market=bchbtc')
            .reply(200, cancelOrders.concat(waitOrders).concat(doneOrders));
    };

    const mockUserOrdersError = () => {
        mockAxios.onGet('/market/orders?market=bchbtc').reply(500, userOrdersError);
    };

    const mockOrdersLowLevel = () => {
        mockAxios.onGet('/market/orders?market=bchbtc&state=cancel').reply(401, unverifiedAccountResponse);
        mockAxios.onGet('/market/orders?market=bchbtc&state=wait').reply(401, unverifiedAccountResponse);
        mockAxios.onGet('/market/orders?market=bchbtc&state=done').reply(401, unverifiedAccountResponse);
    };

    const mockOrderCancel = () => {
        mockAxios.onPost('/market/orders/bchbtc/cancel').reply(200, orderCancel);
    };

    const mockOrderCancelError = () => {
        mockAxios.onPost('/market/orders/bchbtc/cancel').reply(500, orderCancelError);
    };

    const mockOrderExecute = () => {
        mockAxios.onPost('/market/orders').reply(200, executedOrder);
    };

    const mockOrderExecuteError = () => {
        mockAxios.onPost('/market/orders').reply(500, orderExecuteError);
    };

    const mockFees = () => {
        mockAxios.onGet('/public/fees/trading').reply(200, fees);
    };

    const mockFeesError = () => {
        mockAxios.onGet('/public/fees/trading').reply(500, feesError);
    };

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('user with correct level', () => {
        const expectedOrderFetch = {
            type: 'orders/ORDERS_FETCH',
            payload: { market },
        };

        const expectedOrderData = {
            type: 'orders/ORDERS_DATA',
            payload: {
                wait: waitOrders,
                cancel: cancelOrders,
                done: doneOrders,
            },
        };

        it('should fetch orders', async () => {
            mockOrders();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderFetch);
                        expect(actions[1]).toEqual(expectedOrderData);
                        resolve();
                    }
                });
            });
            store.dispatch(ordersFetch({ market }));
            return promise;
        });
    });

    describe('user with low verification level', () => {
        const expectedOrderFetch = {
            type: 'orders/ORDERS_FETCH',
            payload: { market },
        };

        const expectedOrderError = {
            type: 'orders/ORDERS_ERROR',
            payload: {
                code: 401,
                message: 'Please, pass the corresponding verification steps to enable trading.',
            },
        };

        it('should trigger an error', async () => {
            mockOrdersLowLevel();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderFetch);
                        expect(actions[1]).toEqual(expectedOrderError);
                        resolve();
                    }
                });
            });
            store.dispatch(ordersFetch({ market }));
            return promise;
        });
    });

    describe('network error', () => {
        const expectedOrderFetch = {
            type: 'orders/ORDERS_FETCH',
            payload: { market },
        };

        const expectedOrderError = {
            type: 'orders/ORDERS_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        it('should trigger an error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderFetch);
                        expect(actions[1]).toEqual(expectedOrderError);
                        resolve();
                    }
                });
            });
            store.dispatch(ordersFetch({ market }));
            return promise;
        });
    });

    describe('cancel order', async () => {
        const expectedOrderCancelFetch = {
            type: 'orders/CANCEL_FETCH',
            payload: {
                id: 'bchbtc',
            },
         };

        const expectedOrderCancelData = {
            type: 'orders/CANCEL_DATA',
            payload: {
                id: 'bchbtc',
            },
        };

        const expectedOrderCancelError = {
            type: 'orders/CANCEL_ERROR',
            payload: {
                code: 500,
                message: 'Cannot cancel order',
            },
        };

        it('should cancel order', async () => {
            mockOrderCancel();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderCancelFetch);
                        expect(actions[1]).toEqual(expectedOrderCancelData);
                        resolve();
                    }
                });
            });
            store.dispatch(orderCancelFetch({ id: 'bchbtc' }));
            return promise;
        });

        it('should handle cancel order error', async () => {
            mockOrderCancelError();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderCancelFetch);
                        expect(actions[1]).toEqual(expectedOrderCancelError);
                        resolve();
                    }
                });
            });
            store.dispatch(orderCancelFetch({ id: 'bchbtc' }));
            return promise;
        });
    });

    describe('execute order', async () => {
        const order: OrderExecution = {
            market: 'bchbtc',
            side: 'buy',
            volume: '0.001',
            price: '0.002',
            ord_type: 'limit',
        };

        const expectedOrderExecuteFetch = {
            type: 'orders/EXECUTE_FETCH',
            payload: order,
         };

        const expectedOrderExecuteData = {
            type: 'orders/EXECUTE_DATA',
            payload: executedOrder,
        };

        const expectedOrderExecuteError = {
            type: 'orders/EXECUTE_ERROR',
            payload: {
                code: 500,
                message: 'Cannot execute order',
            },
        };

        it('should execute order', async () => {
            mockOrderExecute();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderExecuteFetch);
                        expect(actions[1]).toEqual(expectedOrderExecuteData);
                        resolve();
                    }
                });
            });
            store.dispatch(orderExecuteFetch(order));
            return promise;
        });

        it('should handle order execute error', async () => {
            mockOrderExecuteError();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrderExecuteFetch);
                        expect(actions[1]).toEqual(expectedOrderExecuteError);
                        resolve();
                    }
                });
            });
            store.dispatch(orderExecuteFetch(order));
            return promise;
        });
    });

    describe('fees fetch', async () => {
        const expectedFeesFetch = {
            type: 'orders/FEES_FETCH',
        };

        const expectedFeesData = {
            type: 'orders/FEES_DATA',
            payload: fees,
        };

        const expectedFeesError = {
            type: 'orders/FEES_ERROR',
            payload: {
                code: 500,
                message: 'Cannot fetch fees',
            },
        };

        it('should fetch fees', async () => {
            mockFees();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedFeesFetch);
                        expect(actions[1]).toEqual(expectedFeesData);
                        resolve();
                    }
                });
            });
            store.dispatch(feesFetch());
            return promise;
        });

        it('should handle fees fetch error', async () => {
            mockFeesError();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedFeesFetch);
                        expect(actions[1]).toEqual(expectedFeesError);
                        resolve();
                    }
                });
            });
            store.dispatch(feesFetch());
            return promise;
        });
    });

    describe('user orders', async () => {
        const markets = [
            {
                id: 'bchbtc',
                name: 'BCH/BTC',
            },
        ];

        const expectedOrdersFetch = {
            type: 'orders/USER_ORDERS_FETCH',
            payload: markets,
        };

        const expectedOrdersData = {
            type: 'orders/USER_ORDERS_DATA',
            payload: {
                wait: waitOrders,
                cancel: cancelOrders,
                done: doneOrders,
            },
        };

        const expectedOrdersError = {
            type: 'orders/USER_ORDERS_ERROR',
            payload: {
                code: 500,
                message: 'Cannot fetch orders',
            },
        };

        it('should fetch orders', async () => {
            mockUserOrders();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrdersFetch);
                        expect(actions[1]).toEqual(expectedOrdersData);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersFetch(markets));
            return promise;
        });

        it('should handle fetch orders error', async () => {
            mockUserOrdersError();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedOrdersFetch);
                        expect(actions[1]).toEqual(expectedOrdersError);
                        resolve();
                    }
                });
            });
            store.dispatch(userOrdersFetch(markets));
            return promise;
        });
    });
});
