import { RootState } from '../..';
import { CommonError } from '../../types';
import { Configs } from './types';

export const selectConfigs = (state: RootState): Configs =>
    state.public.configs.data;

export const selectConfigsSuccess = (state: RootState): boolean =>
    state.public.configs.success;

export const selectConfigsLoading = (state: RootState): boolean =>
    state.public.configs.loading;

export const selectConfigsError = (state: RootState): CommonError | undefined =>
    state.public.configs.error;
