import { CommonError } from '../../../types';
import * as actions from './actions';
import { addressesReducer, initialAddressesState } from './reducer';

describe('Addresses reducer', () => {
    const payloadFormData = new FormData();

    const confirmAddressesResponse = {
        message: 'Success',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle SEND_ADDRESSES_FETCH', () => {
        const expectedState = {
            ...initialAddressesState,
            loading: true,
        };
        expect(addressesReducer(initialAddressesState, actions.sendAddresses(payloadFormData))).toEqual(expectedState);
    });

    it('should handle SEND_ADDRESSES_DATA', () => {
        const expectedState = {
            ...initialAddressesState,
            success: confirmAddressesResponse.message,
        };
        expect(addressesReducer(initialAddressesState, actions.sendAddressesData(confirmAddressesResponse))).toEqual(
            expectedState
        );
    });

    it('should handle SEND_ADDRESSES_ERROR', () => {
        const expectedState = {
            ...initialAddressesState,
            error: error,
        };
        expect(addressesReducer(initialAddressesState, actions.sendAddressesError(error))).toEqual(expectedState);
    });
});
