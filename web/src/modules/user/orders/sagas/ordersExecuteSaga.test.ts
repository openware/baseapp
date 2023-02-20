import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../';
import { getOrderAPI } from '../../../../helpers';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { orderExecuteData, orderExecuteError, orderExecuteFetch, OrderExecution } from '../actions';

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

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const expectedActionsSuccess = [orderExecuteFetch(order), orderExecuteData()];

    const expectedActionsError = [
        orderExecuteFetch(order),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: orderExecuteError,
            },
        }),
    ];

    it('should execute order', async () => {
        mockOrderExecute();
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsSuccess.length) {
                    expect(actions).toEqual(expectedActionsSuccess);
                    resolve();
                }
            });
        });
        store.dispatch(orderExecuteFetch(order));

        return promise;
    });

    it('should handle order execute error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsError.length) {
                    expect(actions).toEqual(expectedActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(orderExecuteFetch(order));

        return promise;
    });
});
