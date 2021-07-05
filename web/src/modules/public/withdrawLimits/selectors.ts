import { RootState } from '../..';
import { CommonError } from '../../types';
import { WithdrawLimits } from './types';

export const selectWithdrawLimits = (state: RootState): WithdrawLimits[] =>
    state.public.withdrawLimits.data;

export const selectWithdrawLimitsLoading = (state: RootState): boolean =>
    state.public.withdrawLimits.loading;

export const selectWithdrawLimitsSuccess = (state: RootState): boolean =>
    state.public.withdrawLimits.success;

export const selectWithdrawLimitsError = (state: RootState): CommonError | undefined =>
    state.public.withdrawLimits.error;

export const selectWithdrawLimitsTimestamp = (state: RootState): number | undefined =>
    state.public.withdrawLimits.timestamp;

export const selectShouldWithdrawLimits = (state: RootState): boolean =>
    !selectWithdrawLimitsTimestamp(state) && !selectWithdrawLimitsLoading(state);
