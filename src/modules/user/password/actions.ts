import { CommonError } from '../../types';
import { GeetestCaptchaResponse } from '../auth';
import {
    PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
    PASSWORD_CHANGE_FORGOT_PASSWORD_SUCCESS,
    PASSWORD_FORGOT_ERROR,
    PASSWORD_FORGOT_FETCH,
    PASSWORD_FORGOT_SUCCESS,
} from './constants';

export interface ForgotPasswordFetch {
    type: typeof PASSWORD_FORGOT_FETCH;
    payload: {
        email: string;
        captcha_response?: string | GeetestCaptchaResponse;
    };
}

export interface ForgotPasswordError {
    type: typeof PASSWORD_FORGOT_ERROR;
    error: CommonError;
}

export interface ForgotPasswordSuccess {
    type: typeof PASSWORD_FORGOT_SUCCESS;
}

export interface ChangeForgotPasswordFetch {
    type: typeof PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH;
    payload: {
        reset_password_token: string;
        password: string,
        confirm_password: string;
    };
}

export interface ChangeForgotPasswordSuccess {
    type: typeof PASSWORD_CHANGE_FORGOT_PASSWORD_SUCCESS;
}

export type PasswordAction = ForgotPasswordFetch
    | ForgotPasswordError
    | ForgotPasswordSuccess
    | ChangeForgotPasswordFetch
    | ChangeForgotPasswordSuccess;

export const forgotPassword = (payload: ForgotPasswordFetch['payload']): ForgotPasswordFetch => ({
   type: PASSWORD_FORGOT_FETCH,
   payload,
});

export const forgotPasswordError = (error: CommonError): ForgotPasswordError => ({
    type: PASSWORD_FORGOT_ERROR,
    error,
});

export const forgotPasswordSuccess = (): ForgotPasswordSuccess => ({
    type: PASSWORD_FORGOT_SUCCESS,
});

export const changeForgotPasswordFetch = (payload: ChangeForgotPasswordFetch['payload']): ChangeForgotPasswordFetch => ({
    type: PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
    payload,
});

export const changeForgotPasswordSuccess = (): ChangeForgotPasswordSuccess => ({
    type: PASSWORD_CHANGE_FORGOT_PASSWORD_SUCCESS,
});
