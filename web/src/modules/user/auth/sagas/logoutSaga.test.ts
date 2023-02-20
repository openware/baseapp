import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { userReset } from '../../profile';
import { logoutError, logoutFetch } from '../actions';

describe('Logout saga', () => {
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

    const mockLogout = () => {
        mockAxios.onDelete('/identity/sessions').reply(200);
    };

    const expectedActionsFetch = [logoutFetch(), userReset()];
    const expectedActionsError = [
        logoutFetch(),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: logoutError,
            },
        }),
    ];

    it('should logout user in success flow', async () => {
        mockLogout();
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(logoutFetch());

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
        store.dispatch(logoutFetch());

        return promise;
    });
});
