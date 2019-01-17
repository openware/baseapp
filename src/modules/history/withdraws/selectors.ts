import { RootState } from '../../index';
import { CommonError } from '../../types';
import { Withdraw } from './reducer';

export const selectWithdraws = (state: RootState): Withdraw[] =>
    state.app.withdraws.list;

export const selectWithdrawsLoading = (state: RootState): boolean | undefined =>
    state.app.withdraws.loading;

export const selectWithdrawsError = (state: RootState): CommonError | undefined =>
    state.app.withdraws.error;
