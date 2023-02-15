import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../../../modules/index';
import { CommonError } from '../../../types';
import { apiKeyDelete, apiKeyDeleteFetch, apiKeysError } from '../actions';

describe('api keys saga', () => {
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

    const fakeKeyId = '5c3933e8c8f97071';
    const fakeTotpCode = '666777';
    const fakePayload = { kid: fakeKeyId, totp_code: fakeTotpCode };
    const fakeResponse = { kid: fakeKeyId };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const url = `/resource/api_keys/${fakeKeyId}?totp_code=${fakeTotpCode}`;

    const mockDeleteApiKey = () => {
        mockAxios.onDelete(url).reply(200, fakeResponse);
    };

    const expectedUpdateApiKeyFetchSuccess = [apiKeyDeleteFetch(fakePayload), apiKeyDelete(fakeResponse)];

    const expectedpdateApiKeyFetchError = [
        apiKeyDeleteFetch(fakePayload),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: apiKeysError,
            },
        }),
    ];

    it('should delete api key', async () => {
        mockDeleteApiKey();
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedUpdateApiKeyFetchSuccess.length) {
                    expect(actions).toEqual(expectedUpdateApiKeyFetchSuccess);
                    resolve();
                }
            });
        });
        store.dispatch(apiKeyDeleteFetch(fakePayload));

        return promise;
    });

    it('should trigger an error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedpdateApiKeyFetchError.length) {
                    expect(actions).toEqual(expectedpdateApiKeyFetchError);
                    resolve();
                }
            });
        });
        store.dispatch(apiKeyDeleteFetch(fakePayload));

        return promise;
    });
});
