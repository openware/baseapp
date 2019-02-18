import { CommonError, CommonState } from '../../types';
import { PasswordAction } from './actions';
import {
    CHANGE_FORGOT_PASSWORD_FETCH,
    CHANGE_FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    FORGOT_PASSWORD_FETCH,
    FORGOT_PASSWORD_SUCCESS,
} from './constants';

export interface PasswordState extends CommonState {
    forgotPasswordRequested: boolean;
    forgotPasswordChanged: boolean;
    forgotPasswordError?: CommonError;
}

const initialState: PasswordState = {
    loading: false,
    forgotPasswordRequested: false,
    forgotPasswordChanged: false,
};

export const passwordReducer = (state = initialState, action: PasswordAction) => {
    switch (action.type) {
        case FORGOT_PASSWORD_FETCH:
            return { ...state, loading: true };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPasswordRequested: true,
                loading: false,
            };
        case FORGOT_PASSWORD_ERROR:
            return {
                ...state,
                forgotPasswordError: action.payload,
                loading: false,
            };
        case CHANGE_FORGOT_PASSWORD_FETCH:
            return { ...state, loading: true };
        case CHANGE_FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPasswordChanged: true,
                loading: false,
            };
        default:
            return state;
    }
};
