import { CommonError } from '../../types';
import { WITHDRAWS_DATA, WITHDRAWS_ERROR, WITHDRAWS_FETCH } from './constants';
import { Withdraw } from './reducer';

export interface WithdrawsFetch {
    type: typeof WITHDRAWS_FETCH;
}

export interface WithdrawsData {
    type: typeof WITHDRAWS_DATA;
    payload: Withdraw[];
}

export interface WithdrawsError {
    type: typeof WITHDRAWS_ERROR;
    payload: CommonError;
}

export type WithdrawsActions = WithdrawsFetch | WithdrawsData | WithdrawsError;

export const withdrawsFetch = (): WithdrawsFetch => ({
    type: WITHDRAWS_FETCH,
});

export const withdrawsData = (payload: WithdrawsData['payload']): WithdrawsData => ({
    type: WITHDRAWS_DATA,
    payload,
});

export const withdrawsError = (payload: WithdrawsError['payload']): WithdrawsError => ({
    type: WITHDRAWS_ERROR,
    payload,
});
