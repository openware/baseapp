import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { sendAccessToken, sendAccessTokenData, sendAccessTokenError } from '../actions';

describe('blacklistAccessFetchSaga test', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
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

    it('should send access token', async () => {
        const expectedActions = [
            sendAccessToken({ allowlink_token: '' }),
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
        store.dispatch(sendAccessToken({ allowlink_token: '' }));

        return promise;
    });


    it('should trigger an error', async () => {
        const expectedActions = [
            sendAccessToken({ allowlink_token: '' }),
            sendAccessTokenError(),
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
        store.dispatch(sendAccessToken({ allowlink_token: '' }));

        return promise;
    });
});
