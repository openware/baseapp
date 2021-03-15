import { CommonError } from '../../../modules/types';
import { CreateQuickExchangeActions } from './actions';
import {
    CREATE_QUICK_ORDER_FETCH,
    CREATE_QUICK_ORDER_DATA,
    CREATE_QUICK_ORDER_ERROR,
} from './constants';

export interface QuickExchangeState {
    fetching: boolean;
    success: boolean;
    error?: CommonError;
}

const initialState: QuickExchangeState = {
    fetching: false,
    success: false,
};

export const quickExchangeReducer = (state = initialState, action: CreateQuickExchangeActions) => {
    switch (action.type) {
        case CREATE_QUICK_ORDER_FETCH:
            return { ...state, fetching: true };
        case CREATE_QUICK_ORDER_DATA:
            return {
                ...state,
                success: true,
                fetching: false,
            };
        case CREATE_QUICK_ORDER_ERROR: {
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
