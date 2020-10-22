import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../../../modules/index';
import { CommonError } from '../../../types';
import { ApiKeyDataInterface, apiKeysError, apiKeyUpdate, apiKeyUpdateFetch } from '../actions';

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

    const fakePayloadApiKey: ApiKeyDataInterface = {
        algorithm: 'HS256',
        created_at: '2019-02-14T15:56:57Z',
        kid: '5c3933e8c8f97071',
        scope: Array,
        state: 'active',
        updated_at: '2019-02-14T15:56:57Z',
    };

    const fakeUpdatedApiKey = {
        algorithm: 'HS256',
        created_at: '2019-02-14T15:56:57Z',
        kid: '5c3933e8c8f97071',
        state: 'active',
        updated_at: '2019-02-14T15:56:57Z',
    };

    const fakeKeyId = '5c3933e8c8f97071';
    const fakeTotpCode = '666777';
    const fakePayload = { apiKey: fakePayloadApiKey, totp_code: fakeTotpCode };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const url = `/resource/api_keys/${fakeKeyId}`;

    const mockUpdateApiKey = () => {
        mockAxios.onPatch(url).reply(200, fakeUpdatedApiKey);
    };

    const expectedUpdateApiKeyFetchSuccess = [
        apiKeyUpdateFetch(fakePayload),
        apiKeyUpdate(fakeUpdatedApiKey),
    ];

    const expectedpdateApiKeyFetchError = [
        apiKeyUpdateFetch(fakePayload),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: apiKeysError,
            },
        }),
    ];

    it('should update api key', async () => {
        mockUpdateApiKey();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedUpdateApiKeyFetchSuccess.length) {
                    expect(actions).toEqual(expectedUpdateApiKeyFetchSuccess);
                    resolve();
                }
            });
        });
        store.dispatch(apiKeyUpdateFetch(fakePayload));

        return promise;
    });

    it('should trigger an error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedpdateApiKeyFetchError.length) {
                    expect(actions).toEqual(expectedpdateApiKeyFetchError);
                    resolve();
                }
            });
        });
        store.dispatch(apiKeyUpdateFetch(fakePayload));

        return promise;
    });
});
