import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { getOrderAPI } from '../../../helpers';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { orderExecuteFetch } from './';
import { OrderExecution } from './actions';
import { ORDER_EXECUTE_DATA, ORDER_EXECUTE_ERROR, ORDER_EXECUTE_FETCH } from './constants';


// tslint:disable no-any no-magic-numbers no-console
const debug = false;

describe('Orders', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

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

    const mockOrderExecute = () => {
        mockAxios.onPost(`/api/v2/${getOrderAPI()}/market/orders`).reply(200, executedOrder);
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

    const order: OrderExecution = {
        market: 'bchbtc',
        side: 'buy',
        volume: '0.001',
        price: '0.002',
        ord_type: 'limit',
    };

    const expectedOrderExecuteFetch = {
        type: ORDER_EXECUTE_FETCH,
        payload: order,
    };

    const expectedOrderExecuteData = {
        type: ORDER_EXECUTE_DATA,
    };

    const expectedOrderExecuteError = {
        type: ORDER_EXECUTE_ERROR,
        payload: {
            code: 500,
            message: ['Server error'],
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
        mockNetworkError(mockAxios);
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
