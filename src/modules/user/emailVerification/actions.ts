import {
    CommonError,
} from '../../types';
import {
    SEND_EMAIL_VERIFICATION_DATA,
    SEND_EMAIL_VERIFICATION_ERROR,
    SEND_EMAIL_VERIFICATION_FETCH,
} from './constants';

export interface EmailVerificationData {
    type: typeof SEND_EMAIL_VERIFICATION_DATA;
}

export interface EmailVerificationError {
    type: typeof SEND_EMAIL_VERIFICATION_ERROR;
    error: CommonError;
}

export interface EmailVerificationFetch {
    type: typeof SEND_EMAIL_VERIFICATION_FETCH;
    email: string;
}

export type EmailVerificationAction =
    EmailVerificationData
    | EmailVerificationError
    | EmailVerificationFetch;

export const emailVerificationData = (): EmailVerificationData => ({
    type: SEND_EMAIL_VERIFICATION_DATA,
});

export const emailVerificationError = (error: CommonError): EmailVerificationError => ({
    type: SEND_EMAIL_VERIFICATION_ERROR,
    error,
});

export const emailVerificationFetch = (email: string): EmailVerificationFetch => ({
    type: SEND_EMAIL_VERIFICATION_FETCH,
    email,
});
