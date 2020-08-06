import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { alertPush, rootSaga } from '../../../../modules/index';
import { failNewHistory, fetchNewHistory, successNewHistory } from '../actions';


describe('History saga', () => {
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

    const fakeError = {
        code: 500,
        message: ['Server error'],
        type: 'error',
    };

    const error = {
        code: 500,
        message: ['Server error'],
    };

    const fakeRequest = { currency: 'btc', filter: 'deposit+withdraw', time_from: '1555085773368', time_to: '1555085773900' };

    const fakeSuccessPayload = { list:
        [{
            id: 1,
            created_at: '1555085773369',
            side: 'buy',
            type: 'deposit+withdraw',
            market: 'btczar',
            price: 12,
            amount: 1,
            currency: 'btc',
            state: 'canceled',
            fee: 0.1,
            rid: undefined,
            txid: undefined,
        }],
    };

    const url = `/account/history?currency=${fakeRequest.currency}&filter=${encodeURIComponent(fakeRequest.filter)}&time_from=${fakeRequest.time_from}&time_to=${fakeRequest.time_to}`;
    const mocksHistory = () => {
        mockAxios.onGet(url).reply(200, fakeSuccessPayload.list);
    };

    const expectedActionsFetch = [
        fetchNewHistory(fakeRequest),
        successNewHistory(fakeSuccessPayload),
    ];
    const expectedActionsError = [
        fetchNewHistory(fakeRequest),
        failNewHistory(error),
        alertPush(fakeError),
    ];

    it('should fetch currency deposit + withdraw history in success flow', async () => {
        mocksHistory();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(fetchNewHistory(fakeRequest));

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
        store.dispatch(fetchNewHistory(fakeRequest));

        return promise;
    });
});
