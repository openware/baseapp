it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import MockAdapter from 'axios-mock-adapter';
// import { MockStoreEnhanced } from 'redux-mock-store';
// import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
// import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
// import { alertPush, rootSaga } from '../../../../modules/index';
// import {
//     ApiKeyDataInterface,
//     apiKeysData,
//     apiKeysFetch,
// } from '../actions';

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

//     const fakeApiKeys: ApiKeyDataInterface[] = [
//         {
//             algorithm: 'HS256',
//             created_at: '2019-02-14T15:56:57Z',
//             kid: '5c3933e8c8f97071',
//             scope: Array,
//             state: 'active',
//             updated_at: '2019-02-14T15:56:57Z',
//         },
//         {
//             algorithm: 'HS256',
//             created_at: '2019-02-14T15:58:06Z',
//             kid: 'c6da7aa20353e449',
//             scope: Array,
//             state: 'active',
//             updated_at: '2019-02-14T15:58:06Z',
//         },
//     ];

//     const fakeError = {
//         code: 500,
//         message: ['Server error'],
//         type: 'error',
//     };

//     const mockApiKeys = () => {
//         mockAxios.onGet(`/resource/api_keys`).reply(200, fakeApiKeys);
//     };

//     const expectedApiKeysFetchSuccess = [
//         apiKeysFetch(),
//         apiKeysData(fakeApiKeys),
//     ];

//     const expectedApiKeysFetchError = [
//         apiKeysFetch(),
//         alertPush(fakeError),
//     ];

//     it('should fetch api keys', async () => {
//         mockApiKeys();
//         const promise = new Promise(resolve => {
//             store.subscribe(() => {
//                 const actions = store.getActions();
//                 if (actions.length === expectedApiKeysFetchSuccess.length) {
//                     expect(actions).toEqual(expectedApiKeysFetchSuccess);
//                     resolve();
//                 }
//             });
//         });
//         store.dispatch(apiKeysFetch());

//         return promise;
//     });

//     it('should trigger an error', async () => {
//         mockNetworkError(mockAxios);
//         const promise = new Promise(resolve => {
//             store.subscribe(() => {
//                 const actions = store.getActions();
//                 if (actions.length === expectedApiKeysFetchError.length) {
//                     expect(actions).toEqual(expectedApiKeysFetchError);
//                     resolve();
//                 }
//             });
//         });
//         store.dispatch(apiKeysFetch());

//         return promise;
//     });
// });

