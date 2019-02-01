import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { handleError, rootSaga } from '../../../index';
import {
    failCurrencyHistory,
    fetchCurrencyHistory,
    setFullHistoryLength,
    successCurrencyHistory,
} from '../actions';


describe('CurrencyHistory', () => {
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

    const fakeHistory = [
        {
            id:566,
            currency:'btc',
            amount:'0.99',
            fee:'0.0',
            txid:'4516e174e7f04fafd14026c22d2bc288695aaa96f4b44518aa86ac7e27fc2458',
            created_at:'2018-12-03T17:13:58+01:00',
            confirmations:1,
            completed_at:'2018-12-03T17:14:56+01:00',
            state:'accepted',
        },
        {
            id:393,
            currency:'btc',
            amount:'0.001',
            fee:'0.0',
            txid:'dd5024e99c92aaa8787ed8273c8a6b635388eb4624d9cc1f8e04313dce843180',
            created_at:'2018-11-16T09:56:38+01:00',
            confirmations:0,
            completed_at:'2018-11-16T09:56:56+01:00',
            state:'canceled',
        },
    ];

    const fakeSuccessPayloadFirstPage = { list: fakeHistory, page: 0 };
    const fakeSuccessPayloadNextPage = { list: fakeHistory, page: 2 };
    const fakeFetchPayloadFirstPage = { page: 0, currency: 'btc', type: 'deposits', fullHistory: 0 };
    const fakeFetchPayloadNextPages = { page: 2, currency: 'btc', type: 'deposits', fullHistory: 2 };

    const mockCurrencyHistory = page => {
        mockAxios.onGet(`/account/deposits?limit=6&page=${page}&currency=btc`).reply(200, fakeHistory);
    };

    const mockHistory = () => {
        mockAxios.onGet('/account/deposits?currency=btc').reply(200, fakeHistory);
    };

    const expectedActionsFetchWithFirstPage = [
        fetchCurrencyHistory(fakeFetchPayloadFirstPage),
        setFullHistoryLength(2),
        successCurrencyHistory(fakeSuccessPayloadFirstPage),
    ];
    const expectedActionsFetchWithNextPage = [
        fetchCurrencyHistory(fakeFetchPayloadNextPages),
        successCurrencyHistory(fakeSuccessPayloadNextPage),
    ];
    const expectedActionsError = [
        fetchCurrencyHistory(fakeFetchPayloadFirstPage),
        failCurrencyHistory([]),
        handleError(500),
    ];

    it('should fetch currency deposit history for 1 page in success flow', async () => {
        mockCurrencyHistory(1);
        mockHistory();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetchWithFirstPage.length) {
                    expect(actions).toEqual(expectedActionsFetchWithFirstPage);
                    resolve();
                }
            });
        });
        store.dispatch(fetchCurrencyHistory(fakeFetchPayloadFirstPage));
        return promise;
    });

    it('should fetch currency deposit history for next pages in success flow', async () => {
        mockCurrencyHistory(3);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetchWithNextPage.length) {
                    expect(actions).toEqual(expectedActionsFetchWithNextPage);
                    resolve();
                }
            });
        });

        store.dispatch(fetchCurrencyHistory(fakeFetchPayloadNextPages));
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
        store.dispatch(fetchCurrencyHistory(fakeFetchPayloadFirstPage));
        return promise;
    });
});
