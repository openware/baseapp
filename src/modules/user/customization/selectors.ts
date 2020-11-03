import { RootState } from '../..';
import { CustomizationDataInterface } from '../../public/customization';
import { CommonError } from '../../types';

export const selectCustomizationUpdateData = (state: RootState): CustomizationDataInterface | undefined =>
    state.user.customizationUpdate.data;

export const selectCustomizationUpdateSuccess = (state: RootState): boolean => state.user.customizationUpdate.success;

export const selectCustomizationUpdateLoading = (state: RootState): boolean => state.user.customizationUpdate.loading;

export const selectCustomizationUpdateError = (state: RootState): CommonError | undefined =>
    state.user.customizationUpdate.error;
