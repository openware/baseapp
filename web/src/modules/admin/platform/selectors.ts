import { RootState } from '../..';
import { CommonError } from '../../types';

export const selectPlatformCreateSuccess = (state: RootState): boolean =>
    state.admin.platform.success;

export const selectPlatformCreateLoading = (state: RootState): boolean =>
    state.admin.platform.loading;

export const selectPlatformCreateError = (state: RootState): CommonError | undefined =>
    state.admin.platform.error;
