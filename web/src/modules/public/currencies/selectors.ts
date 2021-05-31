import { RootState } from '../../';
import { CurrenciesState } from './reducer';
import { Currency } from './types';

const selectCurrenciesState = (state: RootState): CurrenciesState => state.public.currencies;

export const selectCurrencies = (state: RootState): Currency[] =>
    selectCurrenciesState(state).list;
