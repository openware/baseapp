import { CommonError } from '../../types';
import { IdentityAction } from './actions';
import {
    SEND_IDENTITY_DATA,
    SEND_IDENTITY_ERROR,
    SEND_IDENTITY_FETCH,
} from './constants';

export interface IdentityState {
    success?: string;
    error?: CommonError;
}

export const initialIdentityState: IdentityState = {};

export const identityReducer = (state = initialIdentityState, action: IdentityAction) => {
    switch (action.type) {
        case SEND_IDENTITY_FETCH:
            return {
                ...state,
                success: undefined,
                error: undefined,
            };
        case SEND_IDENTITY_DATA:
            return {
                ...state,
                success: action.payload.message,
                error: undefined,
            };
        case SEND_IDENTITY_ERROR:
            return {
                success: undefined,
                error: action.payload,
            };
        default:
            return state;
    }
};
