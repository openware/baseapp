import { CommonError } from '../../../types';
import { IdentityAction } from './actions';
import {
    EDIT_IDENTITY_DATA,
    EDIT_IDENTITY_ERROR,
    EDIT_IDENTITY_FETCH,
    SEND_IDENTITY_DATA,
    SEND_IDENTITY_ERROR,
    SEND_IDENTITY_FETCH,
} from './constants';

export interface IdentityState {
    send: {
        success?: string;
        error?: CommonError;
    };
    edit: {
        success?: string;
        error?: CommonError;
    };
}

export const initialIdentityState: IdentityState = {
    send: {},
    edit: {},
};

export const identitySendReducer = (state: IdentityState['send'], action: IdentityAction) => {
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

export const identityEditReducer = (state: IdentityState['edit'], action: IdentityAction) => {
    switch (action.type) {
        case EDIT_IDENTITY_FETCH:
            return {
                ...state,
                success: undefined,
                error: undefined,
            };
        case EDIT_IDENTITY_DATA:
            return {
                ...state,
                success: action.payload.message,
                error: undefined,
            };
        case EDIT_IDENTITY_ERROR:
            return {
                success: undefined,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const identityReducer = (state = initialIdentityState, action: IdentityAction) => {
    switch (action.type) {
        case SEND_IDENTITY_FETCH:
        case SEND_IDENTITY_DATA:
        case SEND_IDENTITY_ERROR:
            const identitySendState = { ...state.send };

            return {
                ...state,
                send: identitySendReducer(identitySendState, action),
            };
        case EDIT_IDENTITY_FETCH:
        case EDIT_IDENTITY_DATA:
        case EDIT_IDENTITY_ERROR:
            const identityEditState = { ...state.edit };

            return {
                ...state,
                edit: identityEditReducer(identityEditState, action),
            };
        default:
            return state;
    }
};
