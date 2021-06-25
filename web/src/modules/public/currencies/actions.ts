import { CURRENCIES_DATA } from './constants';
import { Currency } from './types';

export interface CurrenciesData {
    type: typeof CURRENCIES_DATA;
    payload: Currency[];
}
export type CurrenciesAction = CurrenciesData;

export const currenciesData = (payload: CurrenciesData['payload']): CurrenciesData => ({
    type: CURRENCIES_DATA,
    payload,
});
