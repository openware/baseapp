import { CommonError } from '../../types';
import {
    AUTH_ENTROPY_PASSWORD_DATA,
    AUTH_ENTROPY_PASSWORD_ERROR,
    AUTH_ENTROPY_PASSWORD_FETCH,
    AUTH_LOGOUT_FAILURE,
    AUTH_LOGOUT_FETCH,
    AUTH_SIGN_IN_DATA,
    AUTH_SIGN_IN_ERROR,
    AUTH_SIGN_IN_FETCH,
    AUTH_SIGN_IN_REQUIRE_2FA,
    AUTH_SIGN_IN_REQUIRE_2FA_RESET,
    AUTH_SIGN_UP_DATA,
    AUTH_SIGN_UP_ERROR,
    AUTH_SIGN_UP_FETCH,
    AUTH_SIGN_UP_REQUIRE_VERIFICATION,
    AUTH_TEST_STATE,
    AUTH_VERIFICATION_FETCH,
    AUTH_VERIFICATION_SUCCESS,
} from './constants';

export interface GeetestCaptchaResponse {
    geetest_challenge: string;
    geetest_validate: string;
    geetest_seccode: string;
}

export interface EntropyPasswordFetch {
    type: typeof AUTH_ENTROPY_PASSWORD_FETCH;
    payload: {
        password: string;
    };
}

export interface EntropyPasswordError {
    type: typeof AUTH_ENTROPY_PASSWORD_ERROR;
    error: CommonError;
}

export interface EntropyPasswordData {
    type: typeof AUTH_ENTROPY_PASSWORD_DATA;
    payload: {
        entropy: number;
    };
}
export interface SignInFetch {
    type: typeof AUTH_SIGN_IN_FETCH;
    payload: {
        email: string;
        password: string;
        data?: string;
        otp_code?: string;
        captcha_response?: string | GeetestCaptchaResponse;
    };
}

export interface SignInError {
    type: typeof AUTH_SIGN_IN_ERROR;
    error: CommonError;
}

export interface SignInRequire2FA {
    type: typeof AUTH_SIGN_IN_REQUIRE_2FA;
    payload: {
        require2fa: boolean;
    };
}

export interface SignInData {
    type: typeof AUTH_SIGN_IN_DATA;
}

export interface SignUpFetch {
    type: typeof AUTH_SIGN_UP_FETCH;
    payload: {
        username?: string;
        email: string;
        password: string;
        data: string;
        captcha_response?: string | GeetestCaptchaResponse;
        refid?: string;
    };
    callbackAction?: {
        scope: string;
        component: string;
        key: string;
        value: any;
    };
}

export interface SignUpData {
    type: typeof AUTH_SIGN_UP_DATA;
}

export interface SignUpError {
    type: typeof AUTH_SIGN_UP_ERROR;
    error: CommonError;
}

export interface SignUpRequireVerification {
    type: typeof AUTH_SIGN_UP_REQUIRE_VERIFICATION;
    payload: {
        requireVerification: boolean;
    };
}

export interface VerificationFetch {
    type: typeof AUTH_VERIFICATION_FETCH;
    payload: {
        token: string;
    };
}

export interface VerificationSuccess {
    type: typeof AUTH_VERIFICATION_SUCCESS;
}

export interface LogoutFetch {
    type: typeof AUTH_LOGOUT_FETCH;
}

export interface LogoutFailed {
    type: typeof AUTH_LOGOUT_FAILURE;
    error: CommonError;
}

export interface TestAuthState {
    type: typeof AUTH_TEST_STATE;
}

export interface AuthSignInRequire2FAReset {
    type: typeof AUTH_SIGN_IN_REQUIRE_2FA_RESET;
}

export type AuthAction =
    | SignInFetch
    | SignInData
    | SignInError
    | SignInRequire2FA
    | SignUpData
    | SignUpFetch
    | SignUpError
    | SignUpRequireVerification
    | VerificationFetch
    | VerificationSuccess
    | LogoutFailed
    | LogoutFetch
    | TestAuthState
    | EntropyPasswordFetch
    | EntropyPasswordData
    | EntropyPasswordError
    | AuthSignInRequire2FAReset;

export const entropyPasswordFetch = (payload: EntropyPasswordFetch['payload']): EntropyPasswordFetch => ({
    type: AUTH_ENTROPY_PASSWORD_FETCH,
    payload,
});

export const entropyPasswordData = (payload: EntropyPasswordData['payload']): EntropyPasswordData => ({
    type: AUTH_ENTROPY_PASSWORD_DATA,
    payload,
});

export const entropyPasswordError = (error: CommonError): EntropyPasswordError => ({
    type: AUTH_ENTROPY_PASSWORD_ERROR,
    error,
});

export const signIn = (payload: SignInFetch['payload']): SignInFetch => ({
    type: AUTH_SIGN_IN_FETCH,
    payload,
});

export const signInData = (): SignInData => ({
    type: AUTH_SIGN_IN_DATA,
});

export const signInError = (error: CommonError): SignInError => ({
    type: AUTH_SIGN_IN_ERROR,
    error,
});

export const signInRequire2FA = (payload: SignInRequire2FA['payload']): SignInRequire2FA => ({
    type: AUTH_SIGN_IN_REQUIRE_2FA,
    payload,
});

export const signUp = (
    payload: SignUpFetch['payload'],
    callbackAction?: SignUpFetch['callbackAction'],
): SignUpFetch => ({
    type: AUTH_SIGN_UP_FETCH,
    payload,
    callbackAction,
});

export const signUpData = (): SignUpData => ({
    type: AUTH_SIGN_UP_DATA,
});

export const signUpError = (error: CommonError): SignUpError => ({
    type: AUTH_SIGN_UP_ERROR,
    error,
});

export const signUpRequireVerification = (
    payload: SignUpRequireVerification['payload'],
): SignUpRequireVerification => ({
    type: AUTH_SIGN_UP_REQUIRE_VERIFICATION,
    payload,
});

export const verificationFetch = (payload: VerificationFetch['payload']): VerificationFetch => ({
    type: AUTH_VERIFICATION_FETCH,
    payload,
});

export const verificationSuccess = (): VerificationSuccess => ({
    type: AUTH_VERIFICATION_SUCCESS,
});

export const logoutFetch = (): LogoutFetch => ({
    type: AUTH_LOGOUT_FETCH,
});

export const logoutError = (error: CommonError): LogoutFailed => ({
    type: AUTH_LOGOUT_FAILURE,
    error,
});

export const require2FAReset = (): AuthSignInRequire2FAReset => ({
    type: AUTH_SIGN_IN_REQUIRE_2FA_RESET,
});
