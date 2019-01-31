import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { getTimezone, setTimezone } from '../../../helpers/timezone';
import { depositsFetch } from './actions';
import {
    DEPOSITS_DATA,
    DEPOSITS_ERROR,
    DEPOSITS_FETCH,
} from './constants';

const debug = false;

// tslint:disable no-console
describe('History - deposits', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;
    let tz;

    afterEach(() => {
        mockAxios.reset();
        setTimezone(tz);
    });

    beforeEach(() => {
        tz = getTimezone();
        setTimezone('America/Los_Angeles');
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('Fetch deposits history', () => {
        const deposits = [
            {
                id: 566,
                currency: 'bch',
                amount: '0.99',
                fee: '0.0',
                txid: '4516e174e7f04fafd14026c22d2bc288695aaa96f4b44518aa86ac7e27fc2458',
                created_at: '2018-12-03T17:13:58+01:00',
                confirmations: 1,
                completed_at: '2018-12-03T17:14:56+01:00',
                state: 'accepted',
            },
            {
                id: 393,
                currency: 'btc',
                amount: '0.001',
                fee: '0.0',
                txid: 'dd5024e99c92aaa8787ed8273c8a6b635388eb4624d9cc1f8e04313dce843180',
                created_at: '2018-11-16T09:56:38+01:00',
                confirmations: 0,
                completed_at: '2018-11-16T09:56:56+01:00',
                state: 'accepted',
            },
        ];

        const mockDeposits = () => {
            mockAxios.onGet('/account/deposits').reply(200, deposits);
        };

        const expectedDepositsFetch = {
            type: DEPOSITS_FETCH,
        };

        const expectedDepositsData = {
            type: DEPOSITS_DATA,
            payload: deposits,
        };

        const expectedDepositsError = {
            type: DEPOSITS_ERROR,
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            type: 'error/ERROR_DATA',
            payload: 500,
        };

        it('should fetch deposit history', async () => {
            mockDeposits();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedDepositsFetch);
                        expect(actions[1]).toEqual(expectedDepositsData);
                        resolve();
                    }
                });
            });
            store.dispatch(depositsFetch());
            return promise;
        });

        it('should trigger an error action', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedDepositsFetch);
                        expect(actions[1]).toEqual(expectedDepositsError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(depositsFetch());
            return promise;
        });
    });

});
