import { ConfigsAction } from './actions';
import {
    CONFIGS_FETCH,
    CONFIGS_ERROR,
    CONFIGS_DATA,
} from './constants';

export interface ConfigsState  {
    loading: boolean;
}

export const initialConfigsState: ConfigsState = {
    loading: false,
};

export const configsReducer = (state = initialConfigsState, action: ConfigsAction) => {
    switch (action.type) {
        case CONFIGS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case CONFIGS_DATA:
            return {
                ...state,
                loading: false,
            };
        case CONFIGS_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
