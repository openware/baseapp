import {
    CHANGE_PASSWORD_ERROR,
    CHANGE_PASSWORD_FETCH,
    CHANGE_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    FORGOT_PASSWORD_FETCH,
    FORGOT_PASSWORD_REQUIRE_VERIFICATION,
    FORGOT_PASSWORD_VERIFICATION_FETCH,
    FORGOT_PASSWORD_VERIFICATION_SUCCESS,
    PASSWORD_ERROR,
} from './constants';

export interface PasswordError {
    type: typeof PASSWORD_ERROR;
    payload: {
      code?: number;
      message?: string;
    };
}

export interface ChangePasswordFetch {
    type: typeof CHANGE_PASSWORD_FETCH;
    payload: {
        reset_password_token: string;
        password: string;
    };
}

export interface ChangePasswordError {
    type: typeof CHANGE_PASSWORD_ERROR;
    payload: PasswordError;
}

export interface ChangePasswordSuccess {
    type: typeof CHANGE_PASSWORD_SUCCESS;
}

export interface ForgotPasswordError {
    type: typeof FORGOT_PASSWORD_ERROR;
    payload: PasswordError;
}

export interface ForgotPasswordFetch {
    type: typeof FORGOT_PASSWORD_FETCH;
    payload: {
        email: string;
    };
}

export interface ForgotPasswordRequireVerification {
    type: typeof FORGOT_PASSWORD_REQUIRE_VERIFICATION;
    payload: {
        forgotPasswordRequireVerification: boolean;
    };
}

export interface ForgotPasswordVerificationFetch {
    type: typeof FORGOT_PASSWORD_VERIFICATION_FETCH;
    payload: {
        confirmation_token: string;
    };
}

export interface ForgotPasswordVerificationSuccess {
    type: typeof FORGOT_PASSWORD_VERIFICATION_SUCCESS;
}

export type PasswordAction = PasswordError
    | ForgotPasswordFetch
    | ForgotPasswordError
    | ForgotPasswordRequireVerification
    | ForgotPasswordVerificationFetch
    | ForgotPasswordVerificationSuccess
    | ChangePasswordSuccess
    | ChangePasswordError
    | ChangePasswordFetch;

export const forgotPassword = (payload: ForgotPasswordFetch['payload']): ForgotPasswordFetch => ({
   type: FORGOT_PASSWORD_FETCH,
   payload,
});

export const forgotPasswordError = (payload: ForgotPasswordError['payload']): ForgotPasswordError => ({
    type: FORGOT_PASSWORD_ERROR,
    payload,
});

export const forgotPasswordRequireVerification =
    (payload: ForgotPasswordRequireVerification['payload']): ForgotPasswordRequireVerification => ({
        type: FORGOT_PASSWORD_REQUIRE_VERIFICATION,
        payload,
    });

export const forgotPasswordVerificationFetch = (payload: ForgotPasswordVerificationFetch['payload']): ForgotPasswordVerificationFetch => ({
    type: FORGOT_PASSWORD_VERIFICATION_FETCH,
    payload,
});

export const forgotPasswordVerificationSuccess = (): ForgotPasswordVerificationSuccess => ({
    type: FORGOT_PASSWORD_VERIFICATION_SUCCESS,
});

export const changePassword = (payload: ChangePasswordFetch['payload']): ChangePasswordFetch => ({
   type: CHANGE_PASSWORD_FETCH,
   payload,
});

export const changePasswordSuccess = (): ChangePasswordSuccess => ({
    type: CHANGE_PASSWORD_SUCCESS,
});

export const changePasswordError = (payload: ChangePasswordError['payload']): ChangePasswordError => ({
    type: CHANGE_PASSWORD_ERROR,
    payload,
});
