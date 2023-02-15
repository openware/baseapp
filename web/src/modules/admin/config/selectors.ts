import { RootState } from '../..';
import { CommonError } from '../../types';
import { ConfigUpdateDataInterface } from './types';

export const selectConfigUpdateData = (state: RootState): ConfigUpdateDataInterface | undefined =>
    state.admin.configUpdate.data;

export const selectConfigUpdateSuccess = (state: RootState): boolean => state.admin.configUpdate.success;

export const selectConfigUpdateLoading = (state: RootState): boolean => state.admin.configUpdate.loading;

export const selectConfigUpdateError = (state: RootState): CommonError | undefined => state.admin.configUpdate.error;
