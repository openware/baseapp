import { CommonError, CommonState } from '../../types';
import { ConfigsAction } from './actions';
import {
    CONFIGS_DATA,
    CONFIGS_ERROR,
    CONFIGS_FETCH,
} from './constants';
import { Configs } from './types';

export interface ConfigsState extends CommonState {
    data: Configs;
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

const defaultConfigs: Configs = {
    captcha_type: 'none',
    password_min_entropy: 0,
};

export const initialConfigsState: ConfigsState = {
    loading: false,
    success: false,
    data: defaultConfigs,
};

export const configsReducer = (state = initialConfigsState, action: ConfigsAction) => {
    switch (action.type) {
        case CONFIGS_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case CONFIGS_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case CONFIGS_ERROR:
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
