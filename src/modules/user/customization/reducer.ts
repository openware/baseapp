import { CustomizationDataInterface } from '../../public/customization';
import { CommonError, CommonState } from '../../types';
import { CustomizationUpdateAction } from './actions';
import {
    CUSTOMIZATION_UPDATE,
    CUSTOMIZATION_UPDATE_DATA,
    CUSTOMIZATION_UPDATE_ERROR,
} from './constants';

export interface CustomizationUpdateState extends CommonState {
    data?: CustomizationDataInterface;
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialCustomizationUpdateState: CustomizationUpdateState = {
    loading: false,
    success: false,
};

export const customizationUpdateReducer = (state = initialCustomizationUpdateState, action: CustomizationUpdateAction) => {
    switch (action.type) {
        case CUSTOMIZATION_UPDATE:
            return {
                ...state,
                loading: true,
                success: false,
                data: undefined,
            };
        case CUSTOMIZATION_UPDATE_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case CUSTOMIZATION_UPDATE_ERROR:
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
