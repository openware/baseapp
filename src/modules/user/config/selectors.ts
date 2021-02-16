import { RootState } from '../..';
import { CommonError } from '../../types';
import { ConfigUpdateDataInterface } from './types';

export const selectConfigUpdateData = (state: RootState): ConfigUpdateDataInterface | undefined =>
    state.user.configUpdate.data;

export const selectConfigUpdateSuccess = (state: RootState): boolean =>
    state.user.configUpdate.success;

export const selectConfigUpdateLoading = (state: RootState): boolean =>
    state.user.configUpdate.loading;

export const selectConfigUpdateError = (state: RootState): CommonError | undefined =>
    state.user.configUpdate.error;
