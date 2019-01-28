import { CommonError } from '../types';

import {
    CHANGE_FORGOT_PASSWORD_FETCH,
    CHANGE_FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    FORGOT_PASSWORD_FETCH,
    FORGOT_PASSWORD_SUCCESS,
    TEST_FORGOT_PASSWORD,
} from './constants';

export interface ForgotPasswordFetch {
    type: typeof FORGOT_PASSWORD_FETCH;
    payload: {
        email: string;
    };
}

export interface ForgotPasswordError {
    type: typeof FORGOT_PASSWORD_ERROR;
    payload: CommonError;
}

export interface ForgotPasswordSuccess {
    type: typeof FORGOT_PASSWORD_SUCCESS;
}

export interface ChangeForgotPasswordFetch {
    type: typeof CHANGE_FORGOT_PASSWORD_FETCH;
    payload: {
        reset_password_token: string;
        password: string,
        confirm_password: string;
    };
}

export interface ChangeForgotPasswordSuccess {
    type: typeof CHANGE_FORGOT_PASSWORD_SUCCESS;
}

export interface TestForgotPassword {
    type: typeof TEST_FORGOT_PASSWORD;
}

export type PasswordAction = ForgotPasswordFetch
    | ForgotPasswordError
    | ForgotPasswordSuccess
    | ChangeForgotPasswordFetch
    | ChangeForgotPasswordSuccess
    | TestForgotPassword;

export const forgotPassword = (payload: ForgotPasswordFetch['payload']): ForgotPasswordFetch => ({
   type: FORGOT_PASSWORD_FETCH,
   payload,
});

export const forgotPasswordError = (payload: ForgotPasswordError['payload']): ForgotPasswordError => ({
    type: FORGOT_PASSWORD_ERROR,
    payload,
});

export const forgotPasswordSuccess = (): ForgotPasswordSuccess => ({
    type: FORGOT_PASSWORD_SUCCESS,
});

export const changeForgotPasswordFetch = (payload: ChangeForgotPasswordFetch['payload']): ChangeForgotPasswordFetch => ({
    type: CHANGE_FORGOT_PASSWORD_FETCH,
    payload,
});

export const changeForgotPasswordSuccess = (): ChangeForgotPasswordSuccess => ({
    type: CHANGE_FORGOT_PASSWORD_SUCCESS,
});
