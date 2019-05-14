import { CommonError } from '../../types';
import { withdrawLimitAction } from './actions';
import {
    WITHDRAW_LIMIT_DATA,
    WITHDRAW_LIMIT_ERROR,
    WITHDRAW_LIMIT_FETCH,
} from './constants';
import { WithdrawLimit } from './types';

export interface WithdrawLimitState {
    list: WithdrawLimit[];
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialWithdrawLimitState: WithdrawLimitState = {
    list: [],
    loading: false,
    success: false,
};

export const withdrawLimitReducer = (state = initialWithdrawLimitState, action: withdrawLimitAction): WithdrawLimitState => {
    switch (action.type) {
        case WITHDRAW_LIMIT_FETCH:
            return {
                ...state,
                loading: true,
            };
        case WITHDRAW_LIMIT_DATA:
            const list = [...action.payload];
            return {
                ...state,
                loading: false,
                success: true,
                list,
            };
        case WITHDRAW_LIMIT_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
