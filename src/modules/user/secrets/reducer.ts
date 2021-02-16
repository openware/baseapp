import {
    SET_SECRET_SAGA_FETCH,
    SET_SECRET_SAGA_DATA,
    SET_SECRET_SAGA_ERROR,
} from './constants';
import { SecretActions } from './actions';
import { CommonError } from '../../types';


export interface SecretsState {
    loading: boolean;
    success: boolean;
    error: boolean;
}

const initialState: SecretsState = {
    loading: false,
    success: false,
    error: false,
};

export const secretsReducer = (state = initialState, action: SecretActions) => {
    switch (action.type) {
        case SET_SECRET_SAGA_FETCH:
            return {
                ...initialState,
                loading: true,
            };
        case SET_SECRET_SAGA_DATA:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case SET_SECRET_SAGA_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
            };
        default:
            return state;
    }
};
