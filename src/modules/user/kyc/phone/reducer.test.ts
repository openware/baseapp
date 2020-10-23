import * as actions from './actions';
import { initialPhoneState, phoneReducer } from './reducer';

describe('Phone reducer', () => {
    const sendPhonePayload = {
        phone_number: '38099999999',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const verifyCodeFetchPayload = {
        phone_number: '38099999999',
        verification_code: '000000',
    };

    const verifyCodeDataPayload = {
        message: 'message',
    };

    it('should handle SEND_CODE_FETCH', () => {
        const expectedState = {
            ...initialPhoneState,
            codeSend: false,
            error: undefined,
            successMessage: undefined,
        };
        expect(phoneReducer(initialPhoneState, actions.sendCode(sendPhonePayload))).toEqual(expectedState);
    });

    it('should handle SEND_CODE_DATA', () => {
        const expectedState = {
            ...initialPhoneState,
            codeSend: true,
        };
        expect(phoneReducer(initialPhoneState, actions.sendCodeData())).toEqual(expectedState);
    });

    it('should handle SEND_CODE_ERROR', () => {
        const expectedState = {
            ...initialPhoneState,
            codeSend: false,
            error: error,
        };
        expect(phoneReducer(initialPhoneState, actions.sendCodeError(error))).toEqual(expectedState);
    });

    it('should handle RESEND_CODE_FETCH', () => {
        const expectedState = {
            ...initialPhoneState,
            codeSend: false,
            error: undefined,
            successMessage: undefined,
        };
        expect(phoneReducer(initialPhoneState, actions.resendCode(sendPhonePayload))).toEqual(expectedState);
    });

    it('should handle RESEND_CODE_DATA', () => {
        const expectedState = {
            ...initialPhoneState,
            codeSend: true,
        };
        expect(phoneReducer(initialPhoneState, actions.resendCodeData())).toEqual(expectedState);
    });

    it('should handle RESEND_CODE_ERROR', () => {
        const expectedState = {
            ...initialPhoneState,
            codeSend: false,
            error: error,
        };
        expect(phoneReducer(initialPhoneState, actions.resendCodeError(error))).toEqual(expectedState);
    });

    it('should handle VERIFY_PHONE_FETCH', () => {
        const expectedState = initialPhoneState;
        expect(phoneReducer(initialPhoneState, actions.verifyPhone(verifyCodeFetchPayload))).toEqual(expectedState);
    });

    it('should handle VERIFY_PHONE_DATA', () => {
        const expectedState = {
            ...initialPhoneState,
            successMessage: verifyCodeDataPayload.message,
        };
        expect(phoneReducer(initialPhoneState, actions.verifyPhoneData(verifyCodeDataPayload))).toEqual(expectedState);
    });

    it('should handle VERIFY_PHONE_ERROR', () => {
        const expectedState = {
            ...initialPhoneState,
            codeSend: false,
            error: error,
        };
        expect(phoneReducer(initialPhoneState, actions.verifyPhoneError(error))).toEqual(expectedState);
    });
});
