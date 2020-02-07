import { CommonError } from '../../types';
import {
    AUTH_LOGOUT_FAILURE,
    AUTH_LOGOUT_FETCH,
    AUTH_SIGN_IN_ERROR,
    AUTH_SIGN_IN_FETCH,
    AUTH_SIGN_IN_REQUIRE_2FA,
    AUTH_SIGN_UP_FETCH,
    AUTH_SIGN_UP_ERROR,
    AUTH_SIGN_UP_REQUIRE_VERIFICATION,
    AUTH_TEST_STATE,
    AUTH_VERIFICATION_FETCH,
    AUTH_VERIFICATION_SUCCESS,
    AUTH_ENTROPY_PASSWORD_FETCH,
    AUTH_ENTROPY_PASSWORD_DATA,
    AUTH_ENTROPY_PASSWORD_ERROR,
} from './constants';

export interface GeetestCaptchaResponse {
    geetest_challenge: string;
    geetest_validate: string;
    geetest_seccode: string;
}

export interface EntropyPasswordFetch {
    type: typeof AUTH_ENTROPY_PASSWORD_FETCH;
    payload: {
        password: string,
    };
}

export interface EntropyPasswordError {
    type: typeof AUTH_ENTROPY_PASSWORD_ERROR;
    payload: CommonError;
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
        otp_code?: string;
        lang: string;
    };
}

export interface SignInError {
    type: typeof AUTH_SIGN_IN_ERROR;
    payload: CommonError;
}

export interface SignInRequire2FA {
    type: typeof AUTH_SIGN_IN_REQUIRE_2FA;
    payload: {
        require2fa: boolean;
    };
}

export interface SignUpFetch {
    type: typeof AUTH_SIGN_UP_FETCH;
    payload: {
        email: string;
        password: string;
        captcha_response?: string | GeetestCaptchaResponse;
        refid?: string;
    };
}

export interface SignUpError {
    type: typeof AUTH_SIGN_UP_ERROR;
    payload: CommonError;
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
    payload: CommonError;
}

export interface TestAuthState {
    type: typeof AUTH_TEST_STATE;
}

export type AuthAction =
    | SignInFetch
    | SignInError
    | SignInRequire2FA
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
    | EntropyPasswordError;

export const entropyPasswordFetch = (payload: EntropyPasswordFetch['payload']): EntropyPasswordFetch => ({
    type: AUTH_ENTROPY_PASSWORD_FETCH,
    payload,
});

export const entropyPasswordData = (payload: EntropyPasswordData['payload']): EntropyPasswordData => ({
    type: AUTH_ENTROPY_PASSWORD_DATA,
    payload,
});

export const entropyPasswordError = (payload: EntropyPasswordError['payload']): EntropyPasswordError => ({
    type: AUTH_ENTROPY_PASSWORD_ERROR,
    payload,
});

export const signIn = (payload: SignInFetch['payload']): SignInFetch => ({
    type: AUTH_SIGN_IN_FETCH,
    payload,
});

export const signInError = (payload: SignInError['payload']): SignInError => ({
    type: AUTH_SIGN_IN_ERROR,
    payload,
});

export const signInRequire2FA = (payload: SignInRequire2FA['payload']): SignInRequire2FA => ({
    type: AUTH_SIGN_IN_REQUIRE_2FA,
    payload,
});

export const signUp = (payload: SignUpFetch['payload']): SignUpFetch => ({
    type: AUTH_SIGN_UP_FETCH,
    payload,
});

export const signUpError = (payload: SignUpError['payload']): SignUpError => ({
    type: AUTH_SIGN_UP_ERROR,
    payload,
});

export const signUpRequireVerification = (payload: SignUpRequireVerification['payload']): SignUpRequireVerification => ({
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

export const logoutError = (payload: LogoutFailed['payload']): LogoutFailed => ({
    type: AUTH_LOGOUT_FAILURE,
    payload,
});
