import { CommonError } from '../../../types';
import * as actions from './actions';
import { identityReducer, initialIdentityState } from './reducer';

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
        metadata: `{'nationality': 'nationality'}`,
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle SEND_IDENTITY_FETCH', () => {
        const expectedState = {
            ...initialIdentityState,
            send: {
                ...initialIdentityState.send,
                loading: true,
            },
        };
        expect(identityReducer(initialIdentityState, actions.sendIdentity(confirmIdentityPayload))).toEqual(expectedState);
    });

    it('should handle SEND_IDENTITY_DATA', () => {
        const expectedState = {
            ...initialIdentityState,
            send: {
                ...initialIdentityState.send,
                success: confirmIdentityResponse.message,
                loading: false,
            },
        };
        expect(identityReducer(initialIdentityState, actions.sendIdentityData(confirmIdentityResponse))).toEqual(expectedState);
    });

    it('should handle SEND_IDENTITY_ERROR', () => {
        const expectedState = {
            ...initialIdentityState,
            send: {
                ...initialIdentityState.send,
                error: error,
                loading: false,
            },
         };
        expect(identityReducer(initialIdentityState, actions.sendIdentityError(error))).toEqual(expectedState);
    });

    it('should handle EDIT_IDENTITY_FETCH', () => {
        const expectedState = {
            ...initialIdentityState,
            edit: {
                ...initialIdentityState.edit,
                loading: true,
            },
        };
        expect(identityReducer(initialIdentityState, actions.editIdentity(confirmIdentityPayload))).toEqual(expectedState);
    });

    it('should handle EDIT_IDENTITY_DATA', () => {
        const expectedState = {
            ...initialIdentityState,
            edit: {
                ...initialIdentityState.edit,
                success: confirmIdentityResponse.message,
                loading: false,
            },
        };
        expect(identityReducer(initialIdentityState, actions.editIdentityData(confirmIdentityResponse))).toEqual(expectedState);
    });

    it('should handle EDIT_IDENTITY_ERROR', () => {
        const expectedState = {
            ...initialIdentityState,
            edit: {
                ...initialIdentityState.edit,
                error: error,
                loading: false,
            },
         };
        expect(identityReducer(initialIdentityState, actions.editIdentityError(error))).toEqual(expectedState);
    });
});
