import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { alertPush } from '../../../public/alert';
import { OrderCommon } from '../../../types';
import { openOrdersCancelData, openOrdersCancelError, openOrdersCancelFetch } from '../actions';

describe('Open Orders Cancel', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
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

    const fakeError = {
        code: 500,
        message: ['Server error'],
        type: 'error',
    };

    const fakeHistory: OrderCommon[] = [
        {
            id: 162,
            side: 'buy',
            price: 0.3,
            state: 'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: 123.1234,
            origin_volume: 123.1234,
            executed_volume: 0,
            market: 'ethusd',
        },
        {
            id: 16,
            side: 'sell',
            price: 0.3,
            state: 'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            remaining_volume: 123.1234,
            origin_volume: 123.1234,
            executed_volume: 0,
            market: 'ethusd',
        },
    ];

    const fakeFetchPayload = { id: 16, list: fakeHistory };
    const fakeSuccessPayload = fakeHistory.filter(order => order.id !== fakeFetchPayload.id);

    const mockOrderCancel = id => {
        mockAxios.onPost(`/market/orders/${id}/cancel`).reply(200);
    };

    const expectedActionsFetch = [
        openOrdersCancelFetch(fakeFetchPayload),
        openOrdersCancelData(fakeSuccessPayload),
        alertPush({ message: ['success.order.canceled'], type: 'success'}),
    ];
    const expectedActionsError = [
        openOrdersCancelFetch(fakeFetchPayload),
        openOrdersCancelError(),
        alertPush(fakeError),
    ];

    it('should cancel order', async () => {
        mockOrderCancel(fakeFetchPayload.id);
        const promise = new Promise(resolve => {
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

    it('should trigger an error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
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
