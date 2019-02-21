import {
    CommonError,
} from '../../types';
import { EmailVerificationAction } from './actions';
import {
    EMAIL_VERIFICATION_DATA,
    EMAIL_VERIFICATION_ERROR,
    EMAIL_VERIFICATION_FETCH,
} from './constants';

export interface EmailVerificationState {
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialState: EmailVerificationState = {
    loading: false,
    success: false,
};

export const sendEmailVerificationReducer = (state = initialState, action: EmailVerificationAction) => {
    switch (action.type) {
        case EMAIL_VERIFICATION_DATA:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case EMAIL_VERIFICATION_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        case EMAIL_VERIFICATION_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        default:
            return state;
    }
};
