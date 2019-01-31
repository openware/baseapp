import { CommonError, CommonState } from '../../types';
import { DepositsActions } from './actions';
import {
    DEPOSITS_DATA,
    DEPOSITS_ERROR,
    DEPOSITS_FETCH,
} from './constants';

export interface Deposit {
    currency: string;
}

export interface DepositsState extends CommonState {
    list: Deposit[];
    loading: boolean;
    error?: CommonError;
}

export const initialDepositsState: DepositsState = {
    list: [],
    loading: false,
};

export const depositsReducer = (state = initialDepositsState, action: DepositsActions) => {
    switch (action.type) {
        case DEPOSITS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case DEPOSITS_DATA:
            return {
                list: action.payload,
                loading: false,
            };
        case DEPOSITS_ERROR: {
            return {
                list: [],
                loading: false,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
