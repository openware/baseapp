import { AuthAction, AuthError } from './actions';
import {
    LOGOUT_FAILURE,
    LOGOUT_FETCH,
    SIGN_IN_ERROR,
    SIGN_IN_REQUIRE_2FA,
    SIGN_UP_REQUIRE_VERIFICATION,
    VERIFICATION_FETCH,
    VERIFICATION_SUCCESS,
} from './constants';

export interface AuthState {
    require2FA?: boolean;
    requireVerification?: boolean;
    emailVerified?: boolean;
    logoutError?: string;
    authError?: AuthError;
}

export const initialStateAuth: AuthState = {
    require2FA: false,
    requireVerification: false,
    emailVerified: false,
    logoutError: '',
};

export const authReducer = (state = initialStateAuth, action: AuthAction) => {
    switch (action.type) {
        case SIGN_IN_REQUIRE_2FA:
            return {
                ...state,
                require2FA: action.payload.require2fa,
            };
        case SIGN_UP_REQUIRE_VERIFICATION:
            return {
                ...state,
                requireVerification: action.payload.requireVerification,
            };
        case VERIFICATION_FETCH:
            return { ...state, emailVerified: false };
        case VERIFICATION_SUCCESS:
            return { ...state, emailVerified: true };
        case SIGN_IN_ERROR:
            return { ...state, authError: action.payload };
        case LOGOUT_FETCH:
            return { ...state };
        case LOGOUT_FAILURE:
            return { ...state, logoutError: action.payload.message };
        default:
            return state;
    }
};
