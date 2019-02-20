import { CommonError } from '../../types';
import {
    AUTH_ERROR,
    LOGOUT_FAILURE,
    LOGOUT_FETCH,
    SIGN_IN_ERROR,
    SIGN_IN_FETCH,
    SIGN_IN_REQUIRE_2FA,
    SIGN_UP_FETCH,
    SIGN_UP_REQUIRE_VERIFICATION,
    TEST_AUTH_STATE,
    VERIFICATION_FETCH,
    VERIFICATION_SUCCESS,
} from './constants';

export interface SignInFetch {
    type: typeof SIGN_IN_FETCH;
    payload: {
        email: string;
        password: string;
        otp_code?: string;
    };
}

export interface SignInError {
    type: typeof SIGN_IN_ERROR;
    payload: CommonError;
}

export interface SignInRequire2FA {
    type: typeof SIGN_IN_REQUIRE_2FA;
    payload: {
        require2fa: boolean;
    };
}

export interface SignUpFetch {
    type: typeof SIGN_UP_FETCH;
    payload: {
        email: string;
        password: string;
        recaptcha_response?: string;
        refId?: string;
    };
}

export interface SignUpError {
    type: typeof AUTH_ERROR;
    payload: CommonError;
}

export interface SignUpRequireVerification {
    type: typeof SIGN_UP_REQUIRE_VERIFICATION;
    payload: {
        requireVerification: boolean;
    };
}

export interface VerificationFetch {
    type: typeof VERIFICATION_FETCH;
    payload: {
        token: string;
    };
}

export interface VerificationSuccess {
    type: typeof VERIFICATION_SUCCESS;
}

export interface LogoutFetch {
    type: typeof LOGOUT_FETCH;
}

export interface LogoutFailed {
    type: typeof LOGOUT_FAILURE;
    payload: CommonError;
}

export interface TestAuthState {
    type: typeof TEST_AUTH_STATE;
}

export type AuthAction = SignInFetch
    | SignInError
    | SignInRequire2FA
    | SignUpFetch
    | SignUpError
    | SignUpRequireVerification
    | VerificationFetch
    | VerificationSuccess
    | LogoutFailed
    | LogoutFetch
    | TestAuthState;

export const signIn = (payload: SignInFetch['payload']): SignInFetch => ({
    type: SIGN_IN_FETCH,
    payload,
});

export const signInError = (payload: SignInError['payload']): SignInError => ({
    type: SIGN_IN_ERROR,
    payload,
});

export const signInRequire2FA = (payload: SignInRequire2FA['payload']): SignInRequire2FA => ({
    type: SIGN_IN_REQUIRE_2FA,
    payload,
});

export const signUp = (payload: SignUpFetch['payload']): SignUpFetch => ({
   type: SIGN_UP_FETCH,
   payload,
});

export const signUpError = (payload: SignUpError['payload']): SignUpError => ({
    type: AUTH_ERROR,
    payload,
});

export const signUpRequireVerification =
    (payload: SignUpRequireVerification['payload']): SignUpRequireVerification => ({
        type: SIGN_UP_REQUIRE_VERIFICATION,
        payload,
    });

export const verificationFetch = (payload: VerificationFetch['payload']): VerificationFetch => ({
    type: VERIFICATION_FETCH,
    payload,
});

export const verificationSuccess = (): VerificationSuccess => ({
    type: VERIFICATION_SUCCESS,
});

export const logoutFetch = (): LogoutFetch => ({
    type: LOGOUT_FETCH,
});

export const logoutError = (payload: LogoutFailed['payload']): LogoutFailed => ({
    type: LOGOUT_FAILURE,
    payload,
});
