import { RootState } from '../../';
import { CurrenciesState } from './reducer';
import { Currency } from './types';

const selectCurrenciesState = (state: RootState): CurrenciesState => state.public.currencies;

export const selectCurrencies = (state: RootState): Currency[] => selectCurrenciesState(state).list;

export const selectCurrenciesLoading = (state: RootState): boolean | undefined => selectCurrenciesState(state).loading;

export const selectCurrenciesTimestamp = (state: RootState): number | undefined =>
    selectCurrenciesState(state).timestamp;

export const selectShouldFetchCurrencies = (state: RootState): boolean =>
    !selectCurrenciesTimestamp(state) && !selectCurrenciesLoading(state);
