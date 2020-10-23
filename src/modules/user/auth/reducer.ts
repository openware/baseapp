import { CommonError } from '../../types';
import { AuthAction } from './actions';
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
    AUTH_VERIFICATION_FETCH,
    AUTH_VERIFICATION_SUCCESS,
} from './constants';

export interface AuthState {
    require2FA?: boolean;
    requireVerification?: boolean;
    emailVerified?: boolean;
    logoutError?: CommonError;
    authError?: CommonError;
    signUpError?: CommonError;
    current_password_entropy: number;
    signInLoading: boolean;
    signUpLoading: boolean;
}

export const initialStateAuth: AuthState = {
    require2FA: false,
    requireVerification: false,
    emailVerified: false,
    current_password_entropy: 0,
    signInLoading: false,
    signUpLoading: false,
};

export const authReducer = (state = initialStateAuth, action: AuthAction) => {
    switch (action.type) {
        case AUTH_SIGN_IN_REQUIRE_2FA:
            return {
                ...state,
                require2FA: action.payload.require2fa,
            };
        case AUTH_SIGN_IN_REQUIRE_2FA_RESET:
            return {
                ...state,
                require2FA: false,
                signInLoading: false,
            };
        case AUTH_SIGN_UP_REQUIRE_VERIFICATION:
            return {
                ...state,
                requireVerification: action.payload.requireVerification,
            };
        case AUTH_VERIFICATION_FETCH:
            return { ...state, emailVerified: false };
        case AUTH_VERIFICATION_SUCCESS:
            return { ...state, emailVerified: true };
        case AUTH_SIGN_IN_FETCH:
            return { ...state, signInLoading: true };
        case AUTH_SIGN_IN_DATA:
            return { ...state, signInLoading: false };
        case AUTH_SIGN_IN_ERROR:
            return { ...state, authError: action.error, signInLoading: false };
        case AUTH_SIGN_UP_FETCH:
            return { ...state, signUpLoading: true };
        case AUTH_SIGN_UP_DATA:
            return { ...state, signUpLoading: false };
        case AUTH_SIGN_UP_ERROR:
            return { ...state, signUpError: action.error, signUpLoading: false };
        case AUTH_LOGOUT_FETCH:
            return { ...state };
        case AUTH_LOGOUT_FAILURE:
            return { ...state, logoutError: action.error };
        case AUTH_ENTROPY_PASSWORD_FETCH:
            return { ...state };
        case AUTH_ENTROPY_PASSWORD_DATA:
            return { ...state, current_password_entropy: action.payload.entropy };
        case AUTH_ENTROPY_PASSWORD_ERROR:
            return { ...state };
        default:
            return state;
    }
};
