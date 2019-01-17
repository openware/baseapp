import { RootState } from '../index';
import { CommonError } from '../types';
import { RecentTrade } from './types';

export const selectRecentTrades = (state: RootState): RecentTrade[] =>
    state.app.recentTrades.list;

export const selectRecentTradesLoading = (state: RootState): boolean | undefined =>
    state.app.recentTrades.loading;

export const selectRecentTradesError = (state: RootState): CommonError | undefined =>
    state.app.recentTrades.error;
