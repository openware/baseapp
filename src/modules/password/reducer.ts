import { PasswordAction } from './actions';
import {
    CHANGE_PASSWORD_FETCH,
    CHANGE_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_REQUIRE_VERIFICATION,
    FORGOT_PASSWORD_VERIFICATION_FETCH,
    FORGOT_PASSWORD_VERIFICATION_SUCCESS,
} from './constants';

export interface PasswordState {
    changeForgottenPassword?: boolean;
    forgotPasswordRequireVerification?: boolean;
    emailPasswordVerified?: boolean;
}

const initialState: PasswordState = {
    changeForgottenPassword: false,
    forgotPasswordRequireVerification: false,
    emailPasswordVerified: false,
};

export const passwordReducer = (state = initialState, action: PasswordAction) => {
    switch (action.type) {
        case FORGOT_PASSWORD_REQUIRE_VERIFICATION:
            return {
                ...state,
                forgotPasswordRequireVerification: action.payload.forgotPasswordRequireVerification,
            };
        case FORGOT_PASSWORD_VERIFICATION_FETCH:
            return { ...state, emailPasswordVerified: false };
        case FORGOT_PASSWORD_VERIFICATION_SUCCESS:
            return { ...state, emailPasswordVerified: true };
        case CHANGE_PASSWORD_FETCH:
            return { ...state, changeForgottenPassword: false };
        case CHANGE_PASSWORD_SUCCESS:
            return { ...state, changeForgottenPassword: true };
        default:
            return state;
    }
};
