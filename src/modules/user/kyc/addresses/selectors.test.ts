it('deprecated: saga, reducer, components with redux are tested separatelly', () => {
    expect(true).toBeTruthy();
});

// import { createStore } from 'redux';
// import { rootReducer } from '../../../index';
// import {
//     selectSendAddressesLoading,
//     selectSendAddressesSuccess,
// } from './selectors';

// describe('KYC address selectors', () => {
//     const state = createStore(rootReducer).getState();

//     it('should select loading', () => {
//         expect(selectSendAddressesLoading(state)).toEqual(state.user.addresses.loading);
//     });

//     it('should select loading', () => {
//         expect(selectSendAddressesSuccess(state)).toEqual(state.user.addresses.success);
//     });
// });
