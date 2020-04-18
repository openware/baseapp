import { RootState } from '../..';
import { CommonError } from '../../types';
import {
    CustomizationCurrentDataInterface,
    CustomizationDataInterface,
} from './types';

export const selectCustomizationCurrent = (state: RootState): CustomizationCurrentDataInterface | undefined =>
    state.public.customization.currentData;

export const selectCustomizationData = (state: RootState): CustomizationDataInterface | undefined =>
    state.public.customization.data;

export const selectCustomizationSuccess = (state: RootState): boolean =>
    state.public.customization.success;

export const selectCustomizationLoading = (state: RootState): boolean =>
    state.public.customization.loading;

export const selectCustomizationError = (state: RootState): CommonError | undefined =>
    state.public.customization.error;
