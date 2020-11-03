import { CommonError } from '../../types';
import { CURRENCIES_DATA, CURRENCIES_ERROR, CURRENCIES_FETCH } from './constants';
import { Currency } from './types';

export interface CurrenciesFetch {
    type: typeof CURRENCIES_FETCH;
}

export interface CurrenciesData {
    type: typeof CURRENCIES_DATA;
    payload: Currency[];
}

export interface CurrenciesError {
    type: typeof CURRENCIES_ERROR;
    error: CommonError;
}

export type CurrenciesAction = CurrenciesFetch | CurrenciesData | CurrenciesError;

export const currenciesFetch = (): CurrenciesFetch => ({
    type: CURRENCIES_FETCH,
});

export const currenciesData = (payload: CurrenciesData['payload']): CurrenciesData => ({
    type: CURRENCIES_DATA,
    payload,
});

export const currenciesError = (error: CommonError): CurrenciesError => ({
    type: CURRENCIES_ERROR,
    error,
});
