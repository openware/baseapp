import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { alertPush } from '../../../public/alert';
import { CommonError, OrderCommon } from '../../../types';
import { openOrdersCancelError, openOrdersCancelFetch } from '../actions';

describe('Open Orders Cancel', () => {
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

    const fakeOrder: OrderCommon = {
        id: 16,
        side: 'sell',
        price: '0.3',
        state: 'wait',
        created_at: '2018-11-29T16:54:46+01:00',
        remaining_volume: '123.1234',
        origin_volume: '123.1234',
        executed_volume: '0',
        market: 'ethusd',
    };

    const fakeFinexOrder: OrderCommon = {
        id: 16,
        uuid: '6a7deb5e-5d29-11ea-a122-0242ac140008',
        side: 'sell',
        price: '0.3',
        state: 'wait',
        created_at: '2018-11-29T16:54:46+01:00',
        remaining_volume: '123.1234',
        origin_volume: '123.1234',
        executed_volume: '0',
        market: 'ethusd',
    };

    const fakeHistory: OrderCommon[] = [
        {
            id: 162,
            side: 'buy',
            price: '0.3',
            state: 'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
            executed_volume: '0',
            market: 'ethusd',
        },
        {
            id: 16,
            side: 'sell',
            price: '0.3',
            state: 'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: '123.1234',
            origin_volume: '123.1234',
            executed_volume: '0',
            market: 'ethusd',
        },
    ];

    const fakeFetchPayload = {
        order: fakeOrder,
        list: fakeHistory,
    };

    const fakeFetchFinexPayload = {
        order: fakeFinexOrder,
        list: fakeHistory,
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const mockOrderCancel = (id) => {
        mockAxios.onPost(`/market/orders/${id}/cancel`).reply(200);
    };

    const expectedActionsFetch = [
        openOrdersCancelFetch(fakeFetchPayload),
        alertPush({ message: ['success.order.cancelling'], type: 'success' }),
    ];

    const expectedActionsError = [
        openOrdersCancelFetch(fakeFetchPayload),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: openOrdersCancelError,
            },
        }),
    ];

    const expectedActionsFinexFetch = [
        openOrdersCancelFetch(fakeFetchFinexPayload),
        alertPush({ message: ['success.order.cancelling'], type: 'success' }),
    ];

    it('should cancel order', async () => {
        mockOrderCancel(fakeOrder.id);
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(openOrdersCancelFetch(fakeFetchPayload));

        return promise;
    });

    it('should cancel order with UUID', async () => {
        mockOrderCancel(fakeFinexOrder.uuid);
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFinexFetch.length) {
                    expect(actions).toEqual(expectedActionsFinexFetch);
                    resolve();
                }
            });
        });
        store.dispatch(openOrdersCancelFetch(fakeFetchFinexPayload));

        return promise;
    });

    it('should trigger an error', async () => {
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
        store.dispatch(openOrdersCancelFetch(fakeFetchPayload));

        return promise;
    });
});
