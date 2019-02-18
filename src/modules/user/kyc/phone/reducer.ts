import { CommonError } from '../../../types';
import { PhoneAction } from './actions';
import {
    RESEND_CODE_DATA,
    RESEND_CODE_ERROR,
    RESEND_CODE_FETCH,
    SEND_CODE_DATA,
    SEND_CODE_ERROR,
    SEND_CODE_FETCH,
    VERIFY_PHONE_DATA,
    VERIFY_PHONE_ERROR,
    VERIFY_PHONE_FETCH,
} from './constants';

export interface PhoneState {
    codeSend: boolean;
    error?: CommonError;
    successMessage?: string;
}

export const initialPhoneState: PhoneState = {
    codeSend: false,
};

export const phoneReducer = (state = initialPhoneState, action: PhoneAction) => {
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
        case SEND_CODE_ERROR:
            return {
                codeSend: false,
                error: action.payload,
            };
        case VERIFY_PHONE_DATA:
            return {
                ...state,
                successMessage: action.payload.message,
                error: undefined,
            };
        case VERIFY_PHONE_ERROR:
            return {
                codeSend: false,
                error: action.payload,
            };
        case VERIFY_PHONE_FETCH:
        case RESEND_CODE_FETCH:
            return {
                ...state,
                codeSend: false,
                error: undefined,
                successMessage: undefined,
            };
        case RESEND_CODE_DATA:
            return {
                ...state,
                codeSend: true,
            };

        case RESEND_CODE_ERROR:
            return {
                codeSend: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
