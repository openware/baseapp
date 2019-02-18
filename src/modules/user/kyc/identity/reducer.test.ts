import * as actions from './actions';
import {
    identityReducer,
    initialIdentityState,
} from './reducer';

describe('Identity reducer', () => {
    const confirmIdentityResponse = {
        message: 'Confirmed',
    };

    const confirmIdentityPayload = {
        first_name: 'first_name',
        last_name: 'last_name',
        dob: 'dob',
        address: 'address',
        postcode: 'postcode',
        city: 'city',
        country: 'country',
    };

    const error = {
        code: 500,
        message: 'Server error',
    };

    it('should handle SEND_IDENTITY_FETCH', () => {
        const expectedState = initialIdentityState;
        expect(identityReducer(initialIdentityState, actions.sendIdentity(confirmIdentityPayload))).toEqual(expectedState);
    });

    it('should handle SEND_IDENTITY_DATA', () => {
        const expectedState = {
            ...initialIdentityState,
            success: confirmIdentityResponse.message,
        };
        expect(identityReducer(initialIdentityState, actions.sendIdentityData(confirmIdentityResponse))).toEqual(expectedState);
    });

    it('should handle SEND_IDENTITY_ERROR', () => {
        const expectedState = {
            ...initialIdentityState,
            error: error,
        };
        expect(identityReducer(initialIdentityState, actions.sendIdentityError(error))).toEqual(expectedState);
    });
});
