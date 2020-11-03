import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { rootSaga, sendError } from '../../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { CommonError } from '../../../../types';
import { labelData, labelError, labelFetch } from '../actions';

describe('Module: KYC - label', () => {
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

    const data = [
        {
            created_at: '2018-12-10T12:49:00Z',
            key: 'email',
            scope: 'private',
            updated_at: '2018-12-10T12:49:00Z',
            value: 'verified',
        },
    ];

    const mockLabel = () => {
        mockAxios.onGet('/resource/labels').reply(200, data);
    };

    const expectedActionsFetch = [labelFetch(), labelData(data)];
    const expectedActionsError = [
        labelFetch(),
        sendError({
            error,
            processingType: 'console',
            extraOptions: {
                actionError: labelError,
            },
        }),
    ];

    it('should fetch label in success flow', async () => {
        mockLabel();
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(labelFetch());

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
        store.dispatch(labelFetch());

        return promise;
    });
});
