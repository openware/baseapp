import { RootState } from '../../';
import { WalletHistoryList } from './types';

export const selectHistory = (state: RootState): WalletHistoryList => state.user.history.list;

export const selectCurrentPage = (state: RootState): number => state.user.history.page;

export const selectFirstElemIndex = (state: RootState, limit): number => state.user.history.page * limit + 1;

export const selectLastElemIndex = (state: RootState, limit: number): number =>
    state.user.history.page * limit + state.user.history.list.length;

export const selectNextPageExists = (state: RootState, limit: number): boolean => state.user.history.nextPageExists;

export const selectHistoryLoading = (state: RootState): boolean => state.user.history.fetching;
