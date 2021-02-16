import { CommonError, CommonState } from '../../types';
import { ConfigUpdateAction } from './actions';
import { CONFIG_UPDATE, CONFIG_UPDATE_DATA, CONFIG_UPDATE_ERROR } from './constants';
import { ConfigUpdateDataInterface } from './types';

export interface ConfigUpdateState extends CommonState {
    data?: ConfigUpdateDataInterface;
    loading: boolean;
    success: boolean;
    error?: CommonError;
}

export const initialConfigUpdateState: ConfigUpdateState = {
    loading: false,
    success: false,
};

export const configUpdateReducer = (state = initialConfigUpdateState, action: ConfigUpdateAction) => {
    switch (action.type) {
        case CONFIG_UPDATE:
            return {
                ...state,
                loading: true,
                success: false,
                data: undefined,
            };
        case CONFIG_UPDATE_DATA:
            if (
                action.payload.component === 'baseapp' &&
                action.payload.scope === 'public'
            ) {
                window.env = {
                    ...window.env,
                    [action.payload.key]: action.payload.value
                }
            }

            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case CONFIG_UPDATE_ERROR:
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
