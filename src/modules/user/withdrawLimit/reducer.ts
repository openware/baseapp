import { CommonError } from '../../types';
import { withdrawLimitAction } from './actions';
import {
    WITHDRAW_LIMIT_DATA,
    WITHDRAW_LIMIT_ERROR,
    WITHDRAW_LIMIT_FETCH,
} from './constants';
import { WithdrawLimit } from './types';

export interface WithdrawLimitState {
    data: WithdrawLimit;
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialWithdrawLimitState: WithdrawLimitState = {
    data: {
        limit: '0.0',
        period: 0,
        withdrawal_amount: '0.0',
        currency: '',
    },
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
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
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
