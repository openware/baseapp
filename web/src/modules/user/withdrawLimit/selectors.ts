import { RootState } from '../../';
import { CommonError } from '../../types';
import { WithdrawLimit } from './types';

export const selectWithdrawLimit = (state: RootState): WithdrawLimit =>
    state.user.withdrawLimit.data;

export const selectWithdrawLimitLoading = (state: RootState): boolean =>
    state.user.withdrawLimit.loading;

export const selectWithdrawLimitSuccess = (state: RootState): boolean =>
    state.user.withdrawLimit.success;

export const selectWithdrawLimitError = (state: RootState): CommonError | undefined =>
    state.user.withdrawLimit.error;

