import { Trade } from '../history/trades';
import { RootState } from '../index';
import { CommonError } from '../types';

export const selectRecentTrades = (state: RootState): Trade[] =>
    state.app.recentTrades.list;

export const selectRecentTradesLoading = (state: RootState): boolean | undefined =>
    state.app.recentTrades.loading;

export const selectRecentTradesError = (state: RootState): CommonError | undefined =>
    state.app.recentTrades.error;
