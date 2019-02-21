import {
    CommonError,
} from '../../types';
import {
    EMAIL_VERIFICATION_DATA,
    EMAIL_VERIFICATION_ERROR,
    EMAIL_VERIFICATION_FETCH,
} from './constants';

export interface EmailVerificationData {
    type: typeof EMAIL_VERIFICATION_DATA;
}

export interface EmailVerificationError {
    type: typeof EMAIL_VERIFICATION_ERROR;
    error: CommonError;
}

export interface EmailVerificationFetch {
    type: typeof EMAIL_VERIFICATION_FETCH;
    email: string;
}

export type EmailVerificationAction =
    EmailVerificationData
    | EmailVerificationError
    | EmailVerificationFetch;

export const emailVerificationData = (): EmailVerificationData => ({
    type: EMAIL_VERIFICATION_DATA,
});

export const emailVerificationError = (error: CommonError): EmailVerificationError => ({
    type: EMAIL_VERIFICATION_ERROR,
    error,
});

export const emailVerificationFetch = (email: string): EmailVerificationFetch => ({
    type: EMAIL_VERIFICATION_FETCH,
    email,
});
