import { CommonError } from '../../types';
import { GeetestCaptchaResponse } from '../auth';
import { EMAIL_VERIFICATION_DATA, EMAIL_VERIFICATION_ERROR, EMAIL_VERIFICATION_FETCH } from './constants';

export interface EmailVerificationData {
    type: typeof EMAIL_VERIFICATION_DATA;
}

export interface EmailVerificationError {
    type: typeof EMAIL_VERIFICATION_ERROR;
    error: CommonError;
}

export interface EmailVerificationFetch {
    type: typeof EMAIL_VERIFICATION_FETCH;
    payload: {
      email: string;
      captcha_response?: string | GeetestCaptchaResponse;
    };
}

export type EmailVerificationAction =
    EmailVerificationData
    | EmailVerificationError
    | EmailVerificationFetch;

export const emailVerificationFetch = (payload: EmailVerificationFetch['payload']): EmailVerificationFetch => ({
    type: EMAIL_VERIFICATION_FETCH,
    payload,
});

export const emailVerificationData = (): EmailVerificationData => ({
    type: EMAIL_VERIFICATION_DATA,
});

export const emailVerificationError = (error: CommonError): EmailVerificationError => ({
    type: EMAIL_VERIFICATION_ERROR,
    error,
});
