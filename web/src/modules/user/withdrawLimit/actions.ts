import { CommonError } from '../../types';
import { WITHDRAW_LIMIT_DATA, WITHDRAW_LIMIT_ERROR, WITHDRAW_LIMIT_FETCH } from './constants';
import { WithdrawLimit } from './types';

export interface WithdrawLimitFetch {
    type: typeof WITHDRAW_LIMIT_FETCH;
}

export interface WithdrawLimitData {
    type: typeof WITHDRAW_LIMIT_DATA;
    payload: WithdrawLimit;
}

export interface WithdrawLimitError {
    type: typeof WITHDRAW_LIMIT_ERROR;
    error: CommonError;
}

export type withdrawLimitAction = WithdrawLimitFetch | WithdrawLimitData | WithdrawLimitError;

export const withdrawLimitFetch = (): WithdrawLimitFetch => ({
    type: WITHDRAW_LIMIT_FETCH,
});

export const withdrawLimitData = (payload: WithdrawLimitData['payload']): WithdrawLimitData => ({
    type: WITHDRAW_LIMIT_DATA,
    payload,
});

export const withdrawLimitError = (error: CommonError): WithdrawLimitError => ({
    type: WITHDRAW_LIMIT_ERROR,
    error,
});
