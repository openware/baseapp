import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { getTimezone, setTimezone } from '../../../helpers/timezone';
import { withdrawsFetch } from './actions';
import {
    WITHDRAWS_DATA,
    WITHDRAWS_ERROR,
    WITHDRAWS_FETCH,
} from './constants';

const debug = false;

// tslint:disable no-console
describe('History/Trades', () => {
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

    describe('Fetch trades history', () => {
        const withdraws = [
            {
                id: 339,
                currency: 'ltc',
                type: 'coin',
                amount: '1.0',
                fee: '0.001',
                blockchain_txid: '9206d219a8ccfb4fd777e3823283a28e43d5b2d5b3682bcb9b17364299540c03',
                rid: 'QVMUpgySfa5rg9Ah6iLtPJQoMPChdse6UH',
                state: 'succeed',
                created_at: '2018-12-03T18:03:15+01:00',
                updated_at: '2018-12-03T18:03:28+01:00',
                completed_at: '2018-12-03T18:03:28+01:00',
                done_at: '2018-12-03T18:03:28+01:00',
            },
            {
                id: 299,
                currency: 'btc',
                type: 'coin',
                amount: '0.01',
                fee: '0.0001',
                blockchain_txid: '3a2779e1b924f61a64d6227f5e9151ff18e601a819dd54717adfe271daff171d',
                rid: '2NEkoAbJuSBHDjiGqEtTbcVDyY884hZMTad',
                state: 'succeed',
                created_at: '2018-11-13T12:51:35+01:00',
                updated_at: '2018-11-13T12:51:44+01:00',
                completed_at: '2018-11-13T12:51:44+01:00',
                done_at: '2018-11-13T12:51:44+01:00',
            },
        ];

        const mockWithdraws = () => {
            mockAxios.onGet('/account/withdraws').reply(200, withdraws);
        };

        const expectedWithdrawsFetch = {
            type: WITHDRAWS_FETCH,
        };

        const expectedWithdrawsData = {
            type: WITHDRAWS_DATA,
            payload: withdraws,
        };

        const expectedWithdrawsError = {
            type: WITHDRAWS_ERROR,
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            type: 'error/ERROR_DATA',
            payload: 500,
        };

        it('should fetch wallets', async () => {
            mockWithdraws();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedWithdrawsFetch);
                        expect(actions[1]).toEqual(expectedWithdrawsData);
                        resolve();
                    }
                });
            });
            store.dispatch(withdrawsFetch());
            return promise;
        });

        it('should trigger an error action', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedWithdrawsFetch);
                        expect(actions[1]).toEqual(expectedWithdrawsError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(withdrawsFetch());
            return promise;
        });
    });

});
