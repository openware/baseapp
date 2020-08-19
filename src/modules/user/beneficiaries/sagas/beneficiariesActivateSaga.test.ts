it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import MockAdapter from 'axios-mock-adapter';
// import { MockStoreEnhanced } from 'redux-mock-store';
// import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
// import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
// import { rootSaga } from '../../../../modules/index';
// import {
//     beneficiariesActivate,
//     beneficiariesActivateData,
//     beneficiariesActivateError,
//     beneficiariesDataUpdate,
// } from '../actions';
// import { Beneficiary } from '../types';

// const debug = false;

// describe('Beneficiaries Activate', () => {
//     let store: MockStoreEnhanced;
//     let sagaMiddleware: SagaMiddleware<{}>;
//     let mockAxios: MockAdapter;

//     beforeEach(() => {
//         mockAxios = setupMockAxios();
//         sagaMiddleware = createSagaMiddleware();
//         store = setupMockStore(sagaMiddleware, debug)();
//         sagaMiddleware.run(rootSaga);
//     });

//     afterEach(() => {
//         mockAxios.reset();
//     });

//     const fakePayload = {
//         pin: '123456',
//         id: 1,
//     };

//     const fakeSuccessPayload: Beneficiary = {
//         id: 1,
//         currency: 'eth',
//         name: 'First company',
//         state: 'active',
//         data: {
//             address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
//         },
//     };

//     const fakeError = {
//         code: 500,
//         message: ['Server error'],
//     };


//     describe('Activate beneficiaries data', () => {
//         const mockBeneficiariesActivate = () => {
//             mockAxios.onPatch(`/account/beneficiaries/${fakePayload.id}/activate`).reply(200, fakeSuccessPayload);
//         };

//         const expectedBeneficiariesActivateSuccess = [
//             beneficiariesActivate(fakePayload),
//             beneficiariesActivateData(fakeSuccessPayload),
//             beneficiariesDataUpdate(fakeSuccessPayload),
//         ];

//         const expectedBeneficiariesActivateError = [
//             beneficiariesActivate(fakePayload),
//             beneficiariesActivateError(fakeError),
//         ];

//         it('should activate beneficiaries in success flow', async () => {
//             mockBeneficiariesActivate();

//             const promise = new Promise(resolve => {
//                 store.subscribe(() => {
//                     const actions = store.getActions();
//                     if (actions.length === expectedBeneficiariesActivateSuccess.length) {
//                         expect(actions).toEqual(expectedBeneficiariesActivateSuccess);
//                         resolve();
//                     }
//                 });
//             });
//             store.dispatch(beneficiariesActivate(fakePayload));

//             return promise;
//         });

//         it('should handle activate beneficiaries error', async () => {
//             mockNetworkError(mockAxios);
//             const promise = new Promise(resolve => {
//                 store.subscribe(() => {
//                     const actions = store.getActions();
//                     if (actions.length === expectedBeneficiariesActivateError.length) {
//                         expect(actions).toEqual(expectedBeneficiariesActivateError);
//                         resolve();
//                     }
//                 });
//             });
//             store.dispatch(beneficiariesActivate(fakePayload));

//             return promise;
//         });
//     });
// });
