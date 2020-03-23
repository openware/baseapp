
import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga } from '../../../index';
import {
    failHistory,
    fetchHistory,
    successHistory,
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

    const fakeHeaders = { total: 2 };

    const fakeSuccessPayloadFirstPage = { list: fakeHistory, page: 0, total: fakeHeaders.total };
    const fakeFetchPayloadFirstPage = { page: 0, currency: 'btc', type: 'deposits', limit: 6 };

    const mockHistory = () => {
        mockAxios.onGet(`/account/deposits?page=1&currency=btc&limit=6`).reply(200, fakeHistory, fakeHeaders);
    };

    const expectedActionsFetchWithFirstPage = [
        fetchHistory(fakeFetchPayloadFirstPage),
        successHistory(fakeSuccessPayloadFirstPage),
    ];
    const expectedActionsError = [
        fetchHistory(fakeFetchPayloadFirstPage),
        failHistory([]),
    ];

    it('should fetch currency deposit history for 1 page in success flow', async () => {
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
        store.dispatch(fetchHistory(fakeFetchPayloadFirstPage));
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
        store.dispatch(fetchHistory(fakeFetchPayloadFirstPage));
        return promise;
    });
});
