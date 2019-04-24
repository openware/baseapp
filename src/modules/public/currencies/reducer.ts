import { CommonState } from '../../types';
import { CurrenciesAction } from './actions';
import {
    CURRENCIES_DATA,
    CURRENCIES_ERROR,
    CURRENCIES_FETCH,
} from './constants';
import { Currency } from './types';

export interface CurrenciesState extends CommonState {
    list: Currency[];
    loading: boolean;
}

export const initialCurrenciesState: CurrenciesState = {
    list: [],
    loading: false,
};

export const currenciesReducer = (state = initialCurrenciesState, action: CurrenciesAction) => {
    switch (action.type) {
        case CURRENCIES_FETCH:
            return {
                ...state,
                loading: true,
            };
        case CURRENCIES_DATA:
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        case CURRENCIES_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
