import { CommonError, CommonState } from '../../types';
import { DepositsActions } from './actions';
import {DEPOSITS_DATA, DEPOSITS_ERROR, DEPOSITS_FETCH} from './constants';

export interface Deposit {
    currency: string;
}

export interface DepositsState extends CommonState {
    list: Deposit[];
    error?: CommonError;
}

const initialState: DepositsState = {
    list: [],
    loading: false,
};

export const depositsReducer = (state = initialState, action: DepositsActions) => {
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
