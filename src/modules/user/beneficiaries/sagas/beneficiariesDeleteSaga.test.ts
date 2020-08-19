it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import MockAdapter from 'axios-mock-adapter';
// import { MockStoreEnhanced } from 'redux-mock-store';
// import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
// import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
// import { rootSaga } from '../../../../modules/index';
// import {
//     beneficiariesDelete,
//     beneficiariesDeleteData,
//     beneficiariesDeleteError,
// } from '../actions';

// const debug = false;

// describe('Beneficiaries Delete', () => {
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

//     describe('Delete beneficiary data', () => {
//         const fakePayload = {
//             id: 1,
//         };

//         const fakeSuccessPayload = {
//             id: 1,
//         };

//         const mockBeneficiariesDelete = () => {
//             mockAxios.onDelete(`/account/beneficiaries/${fakePayload.id}`).reply(200, fakeSuccessPayload);
//         };

//         const expectedBeneficiariesDeleteSuccess = [
//             beneficiariesDelete(fakePayload),
//             beneficiariesDeleteData(fakeSuccessPayload),
//         ];

//         const expectedBeneficiariesDeleteError = [
//             beneficiariesDelete(fakePayload),
//             beneficiariesDeleteError({ code: 500, message: ['Server error'] }),
//         ];

//         it('should delete beneficiary in success flow', async () => {
//             mockBeneficiariesDelete();

//             const promise = new Promise(resolve => {
//                 store.subscribe(() => {
//                     const actions = store.getActions();
//                     if (actions.length === expectedBeneficiariesDeleteSuccess.length) {
//                         expect(actions).toEqual(expectedBeneficiariesDeleteSuccess);
//                         resolve();
//                     }
//                 });
//             });
//             store.dispatch(beneficiariesDelete(fakePayload));

//             return promise;
//         });

//         it('should handle delete beneficiary error', async () => {
//             mockNetworkError(mockAxios);
//             const promise = new Promise(resolve => {
//                 store.subscribe(() => {
//                     const actions = store.getActions();
//                     if (actions.length === expectedBeneficiariesDeleteError.length) {
//                         expect(actions).toEqual(expectedBeneficiariesDeleteError);
//                         resolve();
//                     }
//                 });
//             });
//             store.dispatch(beneficiariesDelete(fakePayload));

//             return promise;
//         });
//     });
// });
