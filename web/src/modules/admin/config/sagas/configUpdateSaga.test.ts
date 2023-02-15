import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../../index';
import { CommonError } from '../../../types';
import { configUpdate, configUpdateError } from '../actions';
import { ConfigUpdateDataInterface } from '../types';

describe('Saga: configUpdateSaga', () => {
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

    const fakeConfig: ConfigUpdateDataInterface = {
        scope: 'public',
        key: 'minutesUntilAutoLogout',
        value: '10',
        component: 'global',
    };

    const mockConfigUpdate = () => {
        mockAxios.onPost('/config').reply(200);
    };

    const error: CommonError = {
        message: ['Server error'],
        code: 500,
    };

    it('should update config', async () => {
        const expectedActions = [configUpdate(fakeConfig)];

        mockConfigUpdate();

        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    resolve();
                }
            });
        });

        store.dispatch(configUpdate(fakeConfig));

        return promise;
    });

    it('should trigger an error on config update', async () => {
        const expectedActions = [
            configUpdate(fakeConfig),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: configUpdateError,
                },
            }),
        ];

        mockNetworkError(mockAxios);
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    resolve();
                }
            });
        });
        store.dispatch(configUpdate(fakeConfig));

        return promise;
    });
});
