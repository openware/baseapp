import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../..';
import { CommonError } from '../../../types';
import { p2pCurrenciesData, p2pCurrenciesError, p2pCurrenciesFetch } from '../actions';
import { P2PCurrency } from '../types';

describe('P2P Currencies Fetch', () => {
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

    const fakeP2PCurrenciesArray: P2PCurrency[] = [
        {
            id: 'usdt',
            type: 'coin',
            enabled: true,
        },
        {
            id: 'usdt',
            type: 'coin',
            enabled: true,
        },
    ];

    const mockP2PCurrencies = () => {
        mockAxios.onGet(`/public/currencies`).reply(200, fakeP2PCurrenciesArray);
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const expectedP2PCurrenciesActionsFetch = [
        p2pCurrenciesFetch(),
        p2pCurrenciesData(fakeP2PCurrenciesArray),
    ];

    const expectedP2PCurrenciesActionsError = [
        p2pCurrenciesFetch(),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pCurrenciesError,
            },
        }),
    ];

    it('should fetch p2pCurrencies in success flow', async () => {
        mockP2PCurrencies();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedP2PCurrenciesActionsFetch.length) {
                    expect(actions).toEqual(expectedP2PCurrenciesActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(p2pCurrenciesFetch());

        return promise;
    });

    it('should trigger fetch p2pCurrencies error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedP2PCurrenciesActionsError.length) {
                    expect(actions).toEqual(expectedP2PCurrenciesActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(p2pCurrenciesFetch());

        return promise;
    });
});
