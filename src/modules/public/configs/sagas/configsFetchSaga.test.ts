import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { rootSaga, sendError } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { configsData, configsError, configsFetch } from '../actions';
import { Configs } from '../types';

describe('Saga: configsFetchSaga', () => {
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

    const fakeConfigs: Configs = {
        captcha_type: 'none',
        password_min_entropy: 0,
    };

    const mockConfigs = () => {
        mockAxios.onGet('/identity/configs').reply(200, fakeConfigs);
    };

    const error: CommonError = {
        message: ['Server error'],
        code: 500,
    };

    it('should fetch configs', async () => {
        const expectedActions = [configsFetch(), configsData(fakeConfigs)];

        mockConfigs();
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    resolve();
                }
            });
        });

        store.dispatch(configsFetch());

        return promise;
    });

    it('should trigger an error on configs fetch', async () => {
        const expectedActions = [
            configsFetch(),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: configsError,
                },
            }),
        ];

        mockNetworkError(mockAxios);
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    resolve();
                }
            });
        });
        store.dispatch(configsFetch());

        return promise;
    });
});
