import { CommonError } from '../../types';

import {
    PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
    PASSWORD_CHANGE_FORGOT_PASSWORD_SUCCESS,
    PASSWORD_FORGOT_ERROR,
    PASSWORD_FORGOT_FETCH,
    PASSWORD_FORGOT_SUCCESS,
    PASSWORD_TEST_FORGOT_PASSWORD,
} from './constants';

export interface ForgotPasswordFetch {
    type: typeof PASSWORD_FORGOT_FETCH;
    payload: {
        email: string;
    };
}

export interface ForgotPasswordError {
    type: typeof PASSWORD_FORGOT_ERROR;
    payload: CommonError;
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

export interface TestForgotPassword {
    type: typeof PASSWORD_TEST_FORGOT_PASSWORD;
}

export type PasswordAction = ForgotPasswordFetch
    | ForgotPasswordError
    | ForgotPasswordSuccess
    | ChangeForgotPasswordFetch
    | ChangeForgotPasswordSuccess
    | TestForgotPassword;

export const forgotPassword = (payload: ForgotPasswordFetch['payload']): ForgotPasswordFetch => ({
   type: PASSWORD_FORGOT_FETCH,
   payload,
});

export const forgotPasswordError = (payload: ForgotPasswordError['payload']): ForgotPasswordError => ({
    type: PASSWORD_FORGOT_ERROR,
    payload,
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
