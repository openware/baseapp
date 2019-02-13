import {
    CommonError,
} from '../types';
import { EmailVerificationAction } from './actions';
import {
    SEND_EMAIL_VERIFICATION_DATA,
    SEND_EMAIL_VERIFICATION_ERROR,
    SEND_EMAIL_VERIFICATION_FETCH,
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
        case SEND_EMAIL_VERIFICATION_DATA:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case SEND_EMAIL_VERIFICATION_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        case SEND_EMAIL_VERIFICATION_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        default:
            return state;
    }
};
