it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import MockAdapter from 'axios-mock-adapter';
// import { MockStoreEnhanced } from 'redux-mock-store';
// import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
// import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
// import { alertPush, rootSaga } from '../../../../modules/index';
// import { apiKeyDelete, apiKeyDeleteFetch } from '../actions';

// describe('api keys saga', () => {
//     let store: MockStoreEnhanced;
//     let sagaMiddleware: SagaMiddleware<{}>;
//     let mockAxios: MockAdapter;

//     beforeEach(() => {
//         mockAxios = setupMockAxios();
//         sagaMiddleware = createSagaMiddleware();
//         store = setupMockStore(sagaMiddleware, false)();
//         sagaMiddleware.run(rootSaga);
//     });

//     afterEach(() => {
//         mockAxios.reset();
//     });

//     const fakeKeyId = '5c3933e8c8f97071';
//     const fakeTotpCode = '666777';
//     const fakePayload = { kid: fakeKeyId, totp_code: fakeTotpCode };
//     const fakeResponse = { kid: fakeKeyId };

//     const fakeError = {
//         code: 500,
//         message: ['Server error'],
//         type: 'error',
//     };

//     const url = `/resource/api_keys/${fakeKeyId}?totp_code=${fakeTotpCode}`;

//     const mockDeleteApiKey = () => {
//         mockAxios.onDelete(url).reply(200, fakeResponse);
//     };

//     const expectedUpdateApiKeyFetchSuccess = [
//         apiKeyDeleteFetch(fakePayload),
//         apiKeyDelete(fakeResponse),
//     ];

//     const expectedpdateApiKeyFetchError = [
//         apiKeyDeleteFetch(fakePayload),
//         alertPush(fakeError),
//     ];

//     it('should delete api key', async () => {
//         mockDeleteApiKey();
//         const promise = new Promise(resolve => {
//             store.subscribe(() => {
//                 const actions = store.getActions();
//                 if (actions.length === expectedUpdateApiKeyFetchSuccess.length) {
//                     expect(actions).toEqual(expectedUpdateApiKeyFetchSuccess);
//                     resolve();
//                 }
//             });
//         });
//         store.dispatch(apiKeyDeleteFetch(fakePayload));

//         return promise;
//     });

//     it('should trigger an error', async () => {
//         mockNetworkError(mockAxios);
//         const promise = new Promise(resolve => {
//             store.subscribe(() => {
//                 const actions = store.getActions();
//                 if (actions.length === expectedpdateApiKeyFetchError.length) {
//                     expect(actions).toEqual(expectedpdateApiKeyFetchError);
//                     resolve();
//                 }
//             });
//         });
//         store.dispatch(apiKeyDeleteFetch(fakePayload));

//         return promise;
//     });
// });

