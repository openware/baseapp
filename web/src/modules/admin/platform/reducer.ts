import { CommonError, CommonState } from '../../types';
import { PlatformCreateAction } from './actions';
import { PLATFORM_CREATE, PLATFORM_CREATE_DATA, PLATFORM_CREATE_ERROR } from './constants';

export interface PlatformCreateState extends CommonState {
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialPlatformCreateState: PlatformCreateState = {
    loading: false,
    success: false,
};

export const platformCreateReducer = (state = initialPlatformCreateState, action: PlatformCreateAction) => {
    switch (action.type) {
        case PLATFORM_CREATE:
            return {
                ...initialPlatformCreateState,
                loading: true,
            };
        case PLATFORM_CREATE_DATA:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case PLATFORM_CREATE_ERROR:
            return {
                ...state,
                success: false,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
