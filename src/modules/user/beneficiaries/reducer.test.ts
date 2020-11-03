import { CommonError } from '../../types';
import * as actions from './actions';
import { beneficiariesReducer, initialBeneficiariesState } from './reducer';
import { Beneficiary } from './types';

describe('Beneficiaries reducer', () => {
    const fakeBeneficiaries: Beneficiary[] = [
        {
            id: 1,
            currency: 'eth',
            name: 'First company',
            state: 'active',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
        },
        {
            id: 2,
            currency: 'usd',
            name: 'Second company',
            state: 'archieved',
            description: 'Information about second company',
            data: {
                address: 'Somestreet 42, City',
                country: 'Wakanda',
                full_name: 'Some name',
                account_number: '1234512345',
                account_type: 'Account type',
                bank_name: 'First bank',
                bank_address: 'Anotherstreet 13',
                bank_country: 'Wakanda',
            },
        },
    ];

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle beneficiariesFetch', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            fetch: {
                ...initialBeneficiariesState.fetch,
                fetching: true,
            },
        };

        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesFetch())).toEqual(expectedState);
    });

    it('should handle beneficiariesData', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            fetch: {
                ...initialBeneficiariesState.fetch,
                data: fakeBeneficiaries,
                fetching: false,
                success: true,
            },
        };

        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesData(fakeBeneficiaries))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesDataUpdate', () => {
        const fakeBeneficiary: Beneficiary = {
            id: 1,
            currency: 'eth',
            name: 'Company Name',
            state: 'pending',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
        };

        const fakeUpdatedBeneficiaries: Beneficiary[] = [
            {
                id: 1,
                currency: 'eth',
                name: 'Company Name',
                state: 'pending',
                data: {
                    address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
                },
            },
            {
                id: 2,
                currency: 'usd',
                name: 'Second company',
                state: 'archieved',
                description: 'Information about second company',
                data: {
                    address: 'Somestreet 42, City',
                    country: 'Wakanda',
                    full_name: 'Some name',
                    account_number: '1234512345',
                    account_type: 'Account type',
                    bank_name: 'First bank',
                    bank_address: 'Anotherstreet 13',
                    bank_country: 'Wakanda',
                },
            },
        ];

        const initialState = {
            ...initialBeneficiariesState,
            fetch: {
                ...initialBeneficiariesState.fetch,
                data: fakeBeneficiaries,
            },
        };

        const expectedState = {
            ...initialBeneficiariesState,
            fetch: {
                ...initialBeneficiariesState.fetch,
                data: fakeUpdatedBeneficiaries,
                fetching: false,
                success: true,
                error: undefined,
            },
        };

        expect(beneficiariesReducer(initialState, actions.beneficiariesDataUpdate(fakeBeneficiary))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesError', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            fetch: {
                ...initialBeneficiariesState.fetch,
                data: [],
                fetching: false,
                success: false,
                error: error,
            },
        };

        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesError(error))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesActivate', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            activate: {
                ...initialBeneficiariesState.activate,
                fetching: true,
            },
        };

        const fakePayload = {
            pin: '123456',
            id: 1,
        };

        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesActivate(fakePayload))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesActivateData', () => {
        const fakeActiveBeneficiary: Beneficiary = {
            id: 1,
            currency: 'eth',
            name: 'Company Name',
            state: 'active',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
        };

        const expectedState = {
            ...initialBeneficiariesState,
            activate: {
                ...initialBeneficiariesState.activate,
                data: fakeActiveBeneficiary,
                fetching: false,
                success: true,
            },
        };

        expect(
            beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesActivateData(fakeActiveBeneficiary))
        ).toEqual(expectedState);
    });

    it('should handle beneficiariesActivateError', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            activate: {
                ...initialBeneficiariesState.activate,
                fetching: false,
                success: false,
                error: error,
            },
        };
        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesActivateError(error))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesCreate', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            create: {
                ...initialBeneficiariesState.create,
                fetching: true,
            },
        };

        const fakePayload = {
            currency: 'eth',
            name: 'Company Name',
            description: 'Some description',
            data: '{"address": "0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a"}',
        };

        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesCreate(fakePayload))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesCreateData', () => {
        const fakeBeneficiary: Beneficiary = {
            id: 1,
            currency: 'eth',
            name: 'Company Name',
            state: 'pending',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
        };

        const expectedState = {
            ...initialBeneficiariesState,
            create: {
                ...initialBeneficiariesState.create,
                data: fakeBeneficiary,
                fetching: false,
                success: true,
            },
        };

        expect(
            beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesCreateData(fakeBeneficiary))
        ).toEqual(expectedState);
    });

    it('should handle beneficiariesCreateError', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            create: {
                ...initialBeneficiariesState.create,
                fetching: false,
                success: false,
                error: error,
            },
        };
        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesCreateError(error))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesDelete', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            delete: {
                ...initialBeneficiariesState.delete,
                fetching: true,
            },
        };

        const fakePayload = {
            id: 1,
        };

        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesDelete(fakePayload))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesDeleteData', () => {
        const fakeSuccessPayload = {
            id: 1,
        };

        const expectedState = {
            ...initialBeneficiariesState,
            delete: {
                ...initialBeneficiariesState.delete,
                data: fakeSuccessPayload,
                fetching: false,
                success: true,
            },
        };

        expect(
            beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesDeleteData(fakeSuccessPayload))
        ).toEqual(expectedState);
    });

    it('should handle beneficiariesDeleteError', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            delete: {
                ...initialBeneficiariesState.delete,
                fetching: false,
                success: false,
                error: error,
            },
        };
        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesDeleteError(error))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesResendPin', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            resendPin: {
                ...initialBeneficiariesState.resendPin,
                fetching: true,
            },
        };

        const fakePayload = {
            id: 1,
        };

        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesResendPin(fakePayload))).toEqual(
            expectedState
        );
    });

    it('should handle beneficiariesResendPinData', () => {
        const fakePayload = {
            id: 1,
        };

        const expectedState = {
            ...initialBeneficiariesState,
            resendPin: {
                ...initialBeneficiariesState.resendPin,
                data: fakePayload,
                fetching: false,
                success: true,
            },
        };

        expect(
            beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesResendPinData(fakePayload))
        ).toEqual(expectedState);
    });

    it('should handle beneficiariesResendPinError', () => {
        const expectedState = {
            ...initialBeneficiariesState,
            resendPin: {
                ...initialBeneficiariesState.resendPin,
                fetching: false,
                success: false,
                error: error,
            },
        };
        expect(beneficiariesReducer(initialBeneficiariesState, actions.beneficiariesResendPinError(error))).toEqual(
            expectedState
        );
    });
});
