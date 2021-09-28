import { CommonError } from '../../types';
import * as actions from './actions';
import {
    BENEFICIARIES_ACTIVATE,
    BENEFICIARIES_ACTIVATE_DATA,
    BENEFICIARIES_ACTIVATE_ERROR,
    BENEFICIARIES_CREATE,
    BENEFICIARIES_CREATE_DATA,
    BENEFICIARIES_CREATE_ERROR,
    BENEFICIARIES_DATA,
    BENEFICIARIES_DATA_UPDATE,
    BENEFICIARIES_DELETE,
    BENEFICIARIES_DELETE_DATA,
    BENEFICIARIES_DELETE_ERROR,
    BENEFICIARIES_ERROR,
    BENEFICIARIES_FETCH,
    BENEFICIARIES_RESEND_PIN,
    BENEFICIARIES_RESEND_PIN_DATA,
    BENEFICIARIES_RESEND_PIN_ERROR,
} from './constants';
import { Beneficiary } from './types';

describe('Beneficiaries actions', () => {
    const fakeBeneficiariesArray: Beneficiary[] = [
        {
            id: 1,
            currency: 'eth',
            name: 'First company',
            state: 'active',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
            blockchain_name: '',
            blockchain_key: '',
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
            blockchain_key: '',
            blockchain_name: '',
        },
    ];

    const fakeError: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check beneficiariesActivate action creator', () => {
        const payload = {
            pin: '123456',
            id: 1,
        };

        const expectedAction = { type: BENEFICIARIES_ACTIVATE, payload };
        expect(actions.beneficiariesActivate(payload)).toEqual(expectedAction);
    });

    it('should check beneficiariesActivateData action creator', () => {
        const fakeActiveBeneficiary: Beneficiary = {
            id: 1,
            currency: 'eth',
            name: 'Company Name',
            state: 'active',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
            blockchain_key: '',
            blockchain_name: '',
        };

        const expectedAction = { type: BENEFICIARIES_ACTIVATE_DATA, payload: fakeActiveBeneficiary };
        expect(actions.beneficiariesActivateData(fakeActiveBeneficiary)).toEqual(expectedAction);
    });

    it('should check beneficiariesActivateError action creator', () => {
        const expectedAction = { type: BENEFICIARIES_ACTIVATE_ERROR, error: fakeError };
        expect(actions.beneficiariesActivateError(fakeError)).toEqual(expectedAction);
    });


    it('should check beneficiariesCreate action creator', () => {
        const fakeCreatePayload = {
            currency: 'eth',
            name: 'Company Name',
            description: 'Some description',
            data: '{"address": "0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a"}',
            otp: '',
        };

        const expectedAction = {type: BENEFICIARIES_CREATE, payload: fakeCreatePayload };
        expect(actions.beneficiariesCreate(fakeCreatePayload)).toEqual(expectedAction);
    });

    it('should check beneficiariesCreateData action creator', () => {
        const fakeCreateBeneficiary: Beneficiary = {
            id: 1,
            currency: 'eth',
            name: 'Company Name',
            state: 'pending',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
            blockchain_key: '',
            blockchain_name: '',
        };

        const expectedAction = { type: BENEFICIARIES_CREATE_DATA, payload: fakeCreateBeneficiary };
        expect(actions.beneficiariesCreateData(fakeCreateBeneficiary)).toEqual(expectedAction);
    });

    it('should check beneficiariesCreateError action creator', () => {
        const expectedAction = { type: BENEFICIARIES_CREATE_ERROR, error: fakeError };
        expect(actions.beneficiariesCreateError(fakeError)).toEqual(expectedAction);
    });

    it('should check beneficiariesDelete action creator', () => {
        const payload = {
            id: 1,
            otp: '',
        };

        const expectedAction = {type: BENEFICIARIES_DELETE, payload };
        expect(actions.beneficiariesDelete(payload)).toEqual(expectedAction);
    });

    it('should check beneficiariesDeleteData action creator', () => {
        const payload = {
            id: 1,
        };

        const expectedAction = { type: BENEFICIARIES_DELETE_DATA, payload };
        expect(actions.beneficiariesDeleteData(payload)).toEqual(expectedAction);
    });

    it('should check beneficiariesDeleteError action creator', () => {
        const expectedAction = { type: BENEFICIARIES_DELETE_ERROR, error: fakeError };
        expect(actions.beneficiariesDeleteError(fakeError)).toEqual(expectedAction);
    });

    it('should check beneficiariesFetch action creator', () => {
        const expectedAction = { type: BENEFICIARIES_FETCH, payload: { currency_id: 'btc'} };
        expect(actions.beneficiariesFetch({ currency_id: 'btc' })).toEqual(expectedAction);
    });

    it('should check beneficiariesData action creator', () => {
        const expectedAction = { type: BENEFICIARIES_DATA, payload: fakeBeneficiariesArray };
        expect(actions.beneficiariesData(fakeBeneficiariesArray)).toEqual(expectedAction);
    });

    it('should check beneficiariesDataUpdate action creator', () => {
        const fakeCreateBeneficiary: Beneficiary = {
            id: 1,
            currency: 'eth',
            name: 'Company Name',
            state: 'pending',
            data: {
                address: '0xa96bbd0de64ef10659ae49d5ca4bb8109169007eb90d53aa3f87b6dc65530d8a',
            },
            blockchain_key: '',
            blockchain_name: '',
        };

        const expectedAction = { type: BENEFICIARIES_DATA_UPDATE, payload: fakeCreateBeneficiary };
        expect(actions.beneficiariesDataUpdate(fakeCreateBeneficiary)).toEqual(expectedAction);
    });

    it('should check beneficiariesError action creator', () => {
        const expectedAction = { type: BENEFICIARIES_ERROR, error: fakeError };
        expect(actions.beneficiariesError(fakeError)).toEqual(expectedAction);
    });

    it('should check beneficiariesResendPin action creator', () => {
        const payload = {
            id: 1,
        };

        const expectedAction = { type: BENEFICIARIES_RESEND_PIN, payload };
        expect(actions.beneficiariesResendPin(payload)).toEqual(expectedAction);
    });

    it('should check beneficiariesResendPinData action creator', () => {
        const payload = {
            id: 1,
        };

        const expectedAction = { type: BENEFICIARIES_RESEND_PIN_DATA, payload: payload };
        expect(actions.beneficiariesResendPinData(payload)).toEqual(expectedAction);
    });

    it('should check beneficiariesResendPinError action creator', () => {
        const expectedAction = { type: BENEFICIARIES_RESEND_PIN_ERROR, error: fakeError };
        expect(actions.beneficiariesResendPinError(fakeError)).toEqual(expectedAction);
    });

});
