import { CommonError, CommonState } from '../../types';
import { CustomizationAction } from './actions';
import {
    CUSTOMIZATION_CURRENT,
    CUSTOMIZATION_DATA,
    CUSTOMIZATION_ERROR,
    CUSTOMIZATION_FETCH,
} from './constants';
import {
    CustomizationCurrentDataInterface,
    CustomizationDataInterface,
} from './types';

export interface CustomizationState extends CommonState {
    currentData?: CustomizationCurrentDataInterface;
    data?: CustomizationDataInterface;
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialCustomizationState: CustomizationState = {
    loading: false,
    success: false,
};

export const customizationReducer = (state = initialCustomizationState, action: CustomizationAction) => {
    switch (action.type) {
        case CUSTOMIZATION_CURRENT:
            return {
                ...state,
                currentData: action.payload,
            };
        case CUSTOMIZATION_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case CUSTOMIZATION_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
                success: true,
            };
        case CUSTOMIZATION_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};
