import { ContactActions, ContactError } from './actions';
import {
    SEND_EMAIL_DATA,
    SEND_EMAIL_ERROR,
    SEND_EMAIL_FETCH,
} from './constants';

export interface ContactState {
    error?: ContactError;
    loading?: boolean;
    success?: boolean;
}

const initialState: ContactState = {
    error: undefined,
    loading: false,
    success: false,
};

export const contactReducer = (state = initialState, action: ContactActions) => {
    switch (action.type) {
        case SEND_EMAIL_FETCH:
            return {
                ...state,
                error: undefined,
                loading: true,
                success: false,
            };
        case SEND_EMAIL_DATA:
            return {
                error: undefined,
                loading: false,
                success: true,
            };
        case SEND_EMAIL_ERROR: {
            return {
                loading: false,
                success: false,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
