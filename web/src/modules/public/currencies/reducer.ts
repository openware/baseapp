import { CommonState } from '../../types';
import { CurrenciesAction } from './actions';
import {
    CURRENCIES_DATA,
} from './constants';
import { Currency } from './types';

export interface CurrenciesState extends CommonState {
    list: Currency[];
}

export const initialCurrenciesState: CurrenciesState = {
    list: [],
};

export const currenciesReducer = (state = initialCurrenciesState, action: CurrenciesAction) => {
    switch (action.type) {
        case CURRENCIES_DATA:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
};
