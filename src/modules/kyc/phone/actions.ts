import { CommonError } from '../../types';
import {
    RESEND_CODE_ERROR,
    RESEND_CODE_FETCH,
    SEND_CODE_DATA,
    SEND_CODE_ERROR,
    SEND_CODE_FETCH,
    VERIFY_PHONE_DATA,
    VERIFY_PHONE_ERROR,
    VERIFY_PHONE_FETCH,
} from './constants';

export interface SendCodeFetch {
    type: typeof SEND_CODE_FETCH;
    payload: {
        phone_number: string;
    };
}

export interface SendCodeData {
    type: typeof SEND_CODE_DATA;
}

export interface SendCodeError {
    type: typeof SEND_CODE_ERROR;
    payload: CommonError;
}

export interface ResendCodeFetch {
    type: typeof RESEND_CODE_FETCH;
    payload: {
        phone_number: string;
    };
}

export interface ResendCodeError {
    type: typeof RESEND_CODE_ERROR;
    payload: CommonError;
}

export interface VerifyPhoneFetch {
    type: typeof VERIFY_PHONE_FETCH;
    payload: {
        phone_number: string;
        verification_code: string;
    };
}

export interface VerifyPhoneData {
    type: typeof VERIFY_PHONE_DATA;
    payload: {
        message: string;
    };
}

export interface VerifyPhoneError {
    type: typeof VERIFY_PHONE_ERROR;
    payload: CommonError;
}

export type PhoneAction = SendCodeFetch
    | SendCodeData
    | SendCodeError
    | VerifyPhoneFetch
    | VerifyPhoneData
    | VerifyPhoneError
    | ResendCodeFetch
    | ResendCodeError;

export const sendCode = (payload: SendCodeFetch['payload']): SendCodeFetch => ({
    type: SEND_CODE_FETCH,
    payload,
});

export const sendCodeData = (): SendCodeData => ({
    type: SEND_CODE_DATA,
});

export const sendCodeError = (payload: SendCodeError['payload']): SendCodeError => ({
    type: SEND_CODE_ERROR,
    payload,
});

export const resendCode = (payload: ResendCodeFetch['payload']): ResendCodeFetch => ({
    type: RESEND_CODE_FETCH,
    payload,
});

export const resendCodeError = (payload: ResendCodeError['payload']): ResendCodeError => ({
    type: RESEND_CODE_ERROR,
    payload,
});

export const verifyPhone = (payload: VerifyPhoneFetch['payload']): VerifyPhoneFetch => ({
    type: VERIFY_PHONE_FETCH,
    payload,
});

export const verifyPhoneData = (payload: VerifyPhoneData['payload']): VerifyPhoneData => ({
    type: VERIFY_PHONE_DATA,
    payload,
});

export const verifyPhoneError = (payload: VerifyPhoneError['payload']): VerifyPhoneError => ({
    type: VERIFY_PHONE_ERROR,
    payload,
});
