import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { toggle2faData, toggle2faError, toggle2faFetch, toggleUser2fa } from '../actions';

describe('Module: Toggle 2fa', () => {
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

    const fakeCredentials = {
        code: 'code',
        enable: true,
    };

    const mockToggle2fa = () => {
        mockAxios.onPost('/resource/otp/enable').reply(200);
    };

    const expectedActionsFetch = [toggle2faFetch(fakeCredentials), toggle2faData(), toggleUser2fa()];

    const expectedActionsError = [
        toggle2faFetch(fakeCredentials),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: toggle2faError,
            },
        }),
    ];

    it('should change password in success flow', async () => {
        mockToggle2fa();
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(toggle2faFetch(fakeCredentials));

        return promise;
    });

    it('should trigger an error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsError.length) {
                    expect(actions).toEqual(expectedActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(toggle2faFetch(fakeCredentials));

        return promise;
    });
});
