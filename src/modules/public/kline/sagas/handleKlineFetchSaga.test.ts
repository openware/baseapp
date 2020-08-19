it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import MockAdapter from 'axios-mock-adapter';
// import { MockStoreEnhanced } from 'redux-mock-store';
// import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
// import { getTimestampPeriod } from '../../../../helpers';
// import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
// import { alertPush, rootSaga } from '../../../index';
// import {
//     klineData,
//     klineFetch,
// } from '../actions';


// describe('Kline', () => {
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

//     const fakePayload = {
//         market: 'ethusd',
//         resolution: 60,
//         from: '1593565189',
//         to: '1593678649',
//     };

//     const fakeResponse = [
//         [1, 1, 1, 1, 1, 1],
//         [2, 2, 2, 2, 2, 2],
//     ];

//     const fakeResponseData = [
//         {
//             date: 1000,
//             open: 1,
//             high: 1,
//             low: 1,
//             close: 1,
//             volume: 1,
//         },
//         {
//             date: 2000,
//             open: 2,
//             high: 2,
//             low: 2,
//             close: 2,
//             volume: 2,
//         },
//     ];

//     const fakeError = {
//         code: 500,
//         message: ['Server error'],
//         type: 'error',
//     };

//     const mockKline = () => {
//         mockAxios.onGet(`/public/markets/${fakePayload.market}/k-line?period=${fakePayload.resolution}&` +
//         `time_from=${getTimestampPeriod(fakePayload.from, fakePayload.resolution)}&` +
//         `time_to=${getTimestampPeriod(fakePayload.to, fakePayload.resolution)}`).reply(200, fakeResponse);
//     };

//     const expectedActions = [
//         klineFetch(fakePayload),
//         klineData(fakeResponseData),
//     ];

//     const expectedActionsError = [
//         klineFetch(fakePayload),
//         alertPush(fakeError),
//     ];

//     it('should fetch kline in success flow', async () => {
//         mockKline();
//         const promise = new Promise(resolve => {
//             store.subscribe(() => {
//                 const actions = store.getActions();
//                 if (actions.length === expectedActions.length) {
//                     expect(actions).toEqual(expectedActions);
//                     resolve();
//                 }
//             });
//         });
//         store.dispatch(klineFetch(fakePayload));

//         return promise;
//     });

//     it('should trigger an error', async () => {
//         mockNetworkError(mockAxios);
//         const promise = new Promise(resolve => {
//             store.subscribe(() => {
//                 const actions = store.getActions();
//                 if (actions.length === expectedActionsError.length) {
//                     expect(actions).toEqual(expectedActionsError);
//                     resolve();
//                 }
//             });
//         });
//         store.dispatch(klineFetch(fakePayload));

//         return promise;
//     });
// });
