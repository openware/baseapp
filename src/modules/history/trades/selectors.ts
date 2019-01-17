import { RootState } from '../../index';
import { CommonError } from '../../types';
import { Trade } from './reducer';

export const selectTrades = (state: RootState): Trade[] =>
    state.app.trades.list;

export const selectTradesLoading = (state: RootState): boolean | undefined =>
    state.app.trades.loading;

export const selectTradesError = (state: RootState): CommonError | undefined =>
    state.app.trades.error;
