import { CommonError } from '../../types';
import { WITHDRAWS_DATA, WITHDRAWS_ERROR, WITHDRAWS_FETCH } from './constants';
import { Withdraw } from './reducer';

export interface WithdrawsFetch {
    type: typeof WITHDRAWS_FETCH;
}

export interface WithdrawData {
    type: typeof WITHDRAWS_DATA;
    payload: Withdraw[];
}

export interface WithdrawsError {
    type: typeof WITHDRAWS_ERROR;
    payload: CommonError;
}

export type WithdrawsActions = WithdrawsFetch | WithdrawData | WithdrawsError;

export const withdraws = (): WithdrawsFetch => ({
    type: WITHDRAWS_FETCH,
});
