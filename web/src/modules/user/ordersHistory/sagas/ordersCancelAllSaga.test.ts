import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { alertPush, rootSaga, sendError } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { ordersCancelAllData, ordersCancelAllError, ordersCancelAllFetch } from '../actions';

describe('Orders Cancel All', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const mockCancelAllOrders = () => {
        mockAxios.onPost('/market/orders/cancel').reply(200);
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const expectedActionsSuccess = [
        ordersCancelAllFetch(),
        ordersCancelAllData(),
        alertPush({ message: ['success.order.cancelling.all'], type: 'success' }),
    ];

    const expectedActionsError = [
        ordersCancelAllFetch(),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: ordersCancelAllError,
            },
        }),
    ];

    it('should cancel all open orders', async () => {
        mockCancelAllOrders();
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsSuccess.length) {
                    expect(actions).toEqual(expectedActionsSuccess);
                    resolve();
                }
            });
        });
        store.dispatch(ordersCancelAllFetch());

        return promise;
    });

    it('should trigger an error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsError.length) {
                    expect(actions).toEqual(expectedActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(ordersCancelAllFetch());

        return promise;
    });
});
