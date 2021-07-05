import { RootState } from '../../';
import { CurrenciesState } from './reducer';
import { Currency } from './types';

export const selectCurrenciesState = (state: RootState): CurrenciesState => state.public.currencies;

export const selectCurrencies = (state: RootState): Currency[] =>
    selectCurrenciesState(state).list;
