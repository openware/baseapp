import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError, OrderCommon } from '../../../types';
import { userOrdersHistoryData, userOrdersHistoryError, userOrdersHistoryFetch } from '../actions';

describe('Orders History', () => {
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

    const fakeHistory: OrderCommon[] = [
        {
            id: 162,
            side: 'buy',
            price: '0.3',
            state:'wait',
            created_at: '2018-11-29T16:54:46+01:00',
            origin_volume: '123.1234',
            remaining_volume: '123.1234',
            executed_volume: '0.0',
            market: 'ethbtc',
            ord_type: 'limit',
            avg_price: '0.2',
        },
        {
            id: 16,
            side: 'sell',
            price: '0.3',
            state: 'wait',
            created_at: '2018-11-20T10:24:48+01:00',
            origin_volume: '123.1234',
            remaining_volume: '123.1234',
            executed_volume: '0.0',
            market: 'ethbtc',
            ord_type: 'limit',
            avg_price: '0.2',
        },
    ];

    const fakeFetchPayloadFirstPage = {
        pageIndex: 0,
        type: 'all',
        limit: 25,
    };
    const fakeSuccessPayloadFirstPage = {
        list: fakeHistory,
        pageIndex: 0,
        nextPageExists: false,
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const mockOrdersHistory = () => {
        mockAxios.onGet(`/market/orders?page=1&limit=25`).reply(200, fakeHistory);
    };

    const expectedActionsFetchWithFirstPage = [
        userOrdersHistoryFetch(fakeFetchPayloadFirstPage),
        userOrdersHistoryData(fakeSuccessPayloadFirstPage),
    ];

    const expectedActionsError = [
        userOrdersHistoryFetch(fakeFetchPayloadFirstPage),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: userOrdersHistoryError,
            },
        }),
    ];

    it('should fetch currency deposit history for 1 page in success flow', async () => {
        mockOrdersHistory();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetchWithFirstPage.length) {
                    expect(actions).toEqual(expectedActionsFetchWithFirstPage);
                    resolve();
                }
            });
        });
        store.dispatch(userOrdersHistoryFetch(fakeFetchPayloadFirstPage));

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
        store.dispatch(userOrdersHistoryFetch(fakeFetchPayloadFirstPage));

        return promise;
    });
});
