import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { sendAccessToken, sendAccessTokenData, sendAccessTokenError } from '../actions';

describe('blacklistAccessFetchSaga test', () => {
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

    const fakeResponse = 1;

    const mockRequest = () => {
        mockAxios.onPost('/identity/users/access').reply(200, fakeResponse);
    };

    const error: CommonError = {
        message: ['Server error'],
        code: 500,
    };

    it('should send access token', async () => {
        const expectedActions = [
            sendAccessToken({ whitelink_token: '' }),
            sendAccessTokenData(),
        ];
        mockRequest();

        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    resolve();
                }
            });
        });
        store.dispatch(sendAccessToken({ whitelink_token: '' }));

        return promise;
    });


    it('should trigger an error', async () => {
        const expectedActions = [
            sendAccessToken({ whitelink_token: '' }),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: sendAccessTokenError,
                },
            }),
        ];
        mockNetworkError(mockAxios);

        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    resolve();
                }
            });
        });
        store.dispatch(sendAccessToken({ whitelink_token: '' }));

        return promise;
    });
});
