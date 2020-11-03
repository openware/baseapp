import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { rootSaga, sendError } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { withdrawLimitData, withdrawLimitError, withdrawLimitFetch } from '../actions';

describe('Module: WithdrawLimit', () => {
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

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const fakeData = {
        limit: 3,
        period: 48,
        withdrawal_amount: 0.3,
        currency: 'btc',
    };

    const mockWithdrawLimit = () => {
        mockAxios.onGet('/private/withdraws').reply(200, fakeData);
    };

    const expectedActionsFetch = [withdrawLimitFetch(), withdrawLimitData(fakeData)];

    const expectedActionsError = [
        withdrawLimitFetch(),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: withdrawLimitError,
            },
        }),
    ];

    it('should fetch wallets in success flow', async () => {
        mockWithdrawLimit();
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(withdrawLimitFetch());

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
        store.dispatch(withdrawLimitFetch());

        return promise;
    });
});
