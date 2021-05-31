import { CommonError } from '../../types';
import { withdrawLimitsAction } from './actions';
import { WITHDRAW_LIMITS_DATA, WITHDRAW_LIMITS_ERROR, WITHDRAW_LIMITS_FETCH } from './constants';
import { WithdrawLimits } from './types';

export interface WithdrawLimitsState {
    data: WithdrawLimits[];
    loading: boolean;
    success: boolean;
    error?: CommonError;
    timestamp?: number;
}

export const initialWithdrawLimitsState: WithdrawLimitsState = {
    data: [],
    loading: false,
    success: false,
};

export const withdrawLimitsReducer = (state = initialWithdrawLimitsState, action: withdrawLimitsAction): WithdrawLimitsState => {
    switch (action.type) {
        case WITHDRAW_LIMITS_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case WITHDRAW_LIMITS_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case WITHDRAW_LIMITS_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};
