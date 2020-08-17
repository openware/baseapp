import { CommonError } from '../../../types';
import { AddressesAction } from './actions';
import {
    SEND_ADDRESSES_DATA,
    SEND_ADDRESSES_ERROR,
    SEND_ADDRESSES_FETCH,
} from './constants';

export interface AddressesState {
    success?: string;
    error?: CommonError;
    loading: boolean;
}

export const initialAddressesState: AddressesState = { loading: false };

export const addressesReducer = (state = initialAddressesState, action: AddressesAction) => {
    switch (action.type) {
        case SEND_ADDRESSES_FETCH:
            return {
                ...state,
                success: undefined,
                error: undefined,
                loading: true,
            };
        case SEND_ADDRESSES_DATA:
            return {
                ...state,
                success: action.payload.message,
                error: undefined,
                loading: false,
            };
        case SEND_ADDRESSES_ERROR:
            return {
                success: undefined,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
