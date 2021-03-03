import { CommonError } from '../../../types';
import {
    PHONE_RESEND_CODE_DATA,
    PHONE_RESEND_CODE_ERROR,
    PHONE_RESEND_CODE_FETCH,
    PHONE_SEND_CODE_DATA,
    PHONE_SEND_CODE_ERROR,
    PHONE_SEND_CODE_FETCH,
    PHONE_VERIFY_DATA,
    PHONE_VERIFY_ERROR,
    PHONE_VERIFY_FETCH,
} from './constants';

export interface SendCodeFetch {
    type: typeof PHONE_SEND_CODE_FETCH;
    payload: {
        phone_number: string;
    };
}

export interface SendCodeData {
    type: typeof PHONE_SEND_CODE_DATA;
}

export interface SendCodeError {
    type: typeof PHONE_SEND_CODE_ERROR;
    error: CommonError;
}

export interface ResendCodeFetch {
    type: typeof PHONE_RESEND_CODE_FETCH;
    payload: {
        phone_number: string;
    };
}

export interface ResendCodeData {
    type: typeof PHONE_RESEND_CODE_DATA;
}

export interface ResendCodeError {
    type: typeof PHONE_RESEND_CODE_ERROR;
    error: CommonError;
}

export interface VerifyPhoneFetch {
    type: typeof PHONE_VERIFY_FETCH;
    payload: {
        phone_number: string;
        verification_code: string;
    };
}

export interface VerifyPhoneData {
    type: typeof PHONE_VERIFY_DATA;
    payload: {
        message: string;
    };
}

export interface VerifyPhoneError {
    type: typeof PHONE_VERIFY_ERROR;
    error: CommonError;
}

export type PhoneAction = SendCodeFetch
    | SendCodeData
    | SendCodeError
    | VerifyPhoneFetch
    | VerifyPhoneData
    | VerifyPhoneError
    | ResendCodeFetch
    | ResendCodeError
    | ResendCodeData;

export const sendCode = (payload: SendCodeFetch['payload']): SendCodeFetch => ({
    type: PHONE_SEND_CODE_FETCH,
    payload,
});

export const sendCodeData = (): SendCodeData => ({
    type: PHONE_SEND_CODE_DATA,
});

export const sendCodeError = (error: CommonError): SendCodeError => ({
    type: PHONE_SEND_CODE_ERROR,
    error,
});

export const resendCode = (payload: ResendCodeFetch['payload']): ResendCodeFetch => ({
    type: PHONE_RESEND_CODE_FETCH,
    payload,
});

export const resendCodeData = (): ResendCodeData => ({
    type: PHONE_RESEND_CODE_DATA,
});

export const resendCodeError = (error: CommonError): ResendCodeError => ({
    type: PHONE_RESEND_CODE_ERROR,
    error,
});

export const verifyPhone = (payload: VerifyPhoneFetch['payload']): VerifyPhoneFetch => ({
    type: PHONE_VERIFY_FETCH,
    payload,
});

export const verifyPhoneData = (payload: VerifyPhoneData['payload']): VerifyPhoneData => ({
    type: PHONE_VERIFY_DATA,
    payload,
});

export const verifyPhoneError = (error: CommonError): VerifyPhoneError => ({
    type: PHONE_VERIFY_ERROR,
    error,
});
