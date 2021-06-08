import { CommonError } from '../../types';
import { withdrawLimitsAction } from './actions';
import { WITHDRAW_LIMITS_DATA, WITHDRAW_LIMITS_ERROR, WITHDRAW_LIMITS_FETCH } from './constants';
import { WithdrawLimits } from './types';

export interface WithdrawLimitsState {
    data: WithdrawLimits;
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialWithdrawLimitsState: WithdrawLimitsState = {
    data: {
        created_at: '',
        group: '',
        id: -1,
        kyc_level: '',
        limit_1_month: '',
        limit_24_hour: '',
        updated_at: '',
    },
    loading: false,
    success: false,
};

export const withdrawLimitsReducer = (state = initialWithdrawLimitsState, action: withdrawLimitsAction): WithdrawLimitsState => {
    switch (action.type) {
        case WITHDRAW_LIMITS_FETCH:
            return {
                ...state,
                loading: true,
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
