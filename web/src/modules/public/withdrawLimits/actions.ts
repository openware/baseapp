import { CommonError } from '../../types';
import { WITHDRAW_LIMITS_DATA, WITHDRAW_LIMITS_ERROR, WITHDRAW_LIMITS_FETCH } from './constants';
import { WithdrawLimits } from './types';

export interface WithdrawLimitsFetch {
    type: typeof WITHDRAW_LIMITS_FETCH;
}

export interface WithdrawLimitsData {
    type: typeof WITHDRAW_LIMITS_DATA;
    payload: WithdrawLimits[];
}

export interface WithdrawLimitsError {
    type: typeof WITHDRAW_LIMITS_ERROR;
    error: CommonError;
}

export type withdrawLimitsAction = WithdrawLimitsFetch | WithdrawLimitsData | WithdrawLimitsError;

export const withdrawLimitsFetch = (): WithdrawLimitsFetch => ({
    type: WITHDRAW_LIMITS_FETCH,
});

export const withdrawLimitsData = (payload: WithdrawLimitsData['payload']): WithdrawLimitsData => ({
    type: WITHDRAW_LIMITS_DATA,
    payload,
});

export const withdrawLimitsError = (error: CommonError): WithdrawLimitsError => ({
    type: WITHDRAW_LIMITS_ERROR,
    error,
});
