import { CommonError } from '../../types';
import { PhoneAction } from './actions';
import {
    RESEND_CODE_ERROR,
    SEND_CODE_DATA,
    SEND_CODE_ERROR,
    SEND_CODE_FETCH,
    VERIFY_PHONE_DATA,
    VERIFY_PHONE_ERROR,
} from './constants';

export interface PhoneState {
    codeSend: boolean;
    error?: CommonError;
    successMessage?: string;
}

const initialState: PhoneState = {
    codeSend: false,
};

export const phoneReducer = (state = initialState, action: PhoneAction) => {
    switch (action.type) {
        case SEND_CODE_FETCH:
            return {
                ...state,
                codeSend: false,
                error: undefined,
                successMessage: undefined,
            };
        case SEND_CODE_DATA:
            return {
                ...state,
                codeSend: true,
            };
        case VERIFY_PHONE_DATA:
            return {
                ...state,
                successMessage: action.payload.message,
                error: undefined,
            };
        case VERIFY_PHONE_ERROR:
        case RESEND_CODE_ERROR:
        case SEND_CODE_ERROR:
            return {
                codeSend: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
