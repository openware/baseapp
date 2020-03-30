import { CustomizationDataInterface } from '../../public/customization';
import { CommonError } from '../../types';
import {
    CUSTOMIZATION_UPDATE,
    CUSTOMIZATION_UPDATE_DATA,
    CUSTOMIZATION_UPDATE_ERROR,
} from './constants';

export interface CustomizationUpdate {
    type: typeof CUSTOMIZATION_UPDATE;
    payload: CustomizationDataInterface;
}

export interface CustomizationUpdateData {
    type: typeof CUSTOMIZATION_UPDATE_DATA;
    payload: CustomizationDataInterface;
}

export interface CustomizationUpdateError {
    type: typeof CUSTOMIZATION_UPDATE_ERROR;
    error: CommonError;
}

export type CustomizationUpdateAction =
    CustomizationUpdate
    | CustomizationUpdateData
    | CustomizationUpdateError;

export const customizationUpdate = (payload: CustomizationUpdate['payload']): CustomizationUpdate => ({
    type: CUSTOMIZATION_UPDATE,
    payload,
});

export const customizationUpdateData = (payload: CustomizationUpdateData['payload']): CustomizationUpdateData => ({
    type: CUSTOMIZATION_UPDATE_DATA,
    payload,
});

export const customizationUpdateError = (error: CommonError): CustomizationUpdateError => ({
    type: CUSTOMIZATION_UPDATE_ERROR,
    error,
});
