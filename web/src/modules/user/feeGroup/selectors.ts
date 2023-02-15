import { RootState } from '../..';
import { CommonError } from '../../types';
import { FeeGroup } from './types';

export const selectFeeGroup = (state: RootState): FeeGroup => state.user.feeGroup.data;

export const selectFeeGroupLoading = (state: RootState): boolean => state.user.feeGroup.loading;

export const selectFeeGroupSuccess = (state: RootState): boolean => state.user.feeGroup.success;

export const selectFeeGroupError = (state: RootState): CommonError | undefined => state.user.feeGroup.error;

export const selectUserFeeGroupTimestamp = (state: RootState): number | undefined => state.user.feeGroup.timestamp;

export const selectShouldFetchFeeGroup = (state: RootState): boolean =>
    !selectUserFeeGroupTimestamp(state) && !selectFeeGroupLoading(state);
