import { CommonError } from '../../../modules/types';
import { CreateInternalTransfersActions } from './actions';
import {
    CREATE_INTERNAL_TRANSFERS_DATA,
    CREATE_INTERNAL_TRANSFERS_ERROR,
    CREATE_INTERNAL_TRANSFERS_FETCH,
} from './constants';

export interface InternalTransfersState {
    fetching: boolean;
    success: boolean;
    error?: CommonError;
}

const initialState: InternalTransfersState = {
    fetching: false,
    success: false,
};

export const internalTransfersReducer = (state = initialState, action: CreateInternalTransfersActions) => {
    switch (action.type) {
        case CREATE_INTERNAL_TRANSFERS_FETCH:
            return { ...state, fetching: true };
        case CREATE_INTERNAL_TRANSFERS_DATA:
            return {
                ...state,
                success: true,
                fetching: false,
            };
        case CREATE_INTERNAL_TRANSFERS_ERROR: {
            return {
                ...state,
                error: action.error,
                fetching: false,
                success: false,
            };
        }
        default:
            return state;
    }
};
