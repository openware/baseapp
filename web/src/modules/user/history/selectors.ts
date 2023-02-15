import { RootState } from '../../';
import { WalletHistoryList } from './types';

export const selectHistoryDeposits = (state: RootState): WalletHistoryList => state.user.history.deposits;

export const selectHistoryWithdraws = (state: RootState): WalletHistoryList => state.user.history.withdraws;

export const selectHistoryTrades = (state: RootState): WalletHistoryList => state.user.history.trades;

export const selectHistoryTransfers = (state: RootState): WalletHistoryList => state.user.history.transfers;

export const selectHistory = (state: RootState): WalletHistoryList => {
    const { deposits, withdraws, trades, transfers } = state.user.history;

    if (deposits.length) {
        return deposits;
    }

    if (withdraws.length) {
        return withdraws;
    }

    if (trades.length) {
        return trades;
    }

    if (transfers.length) {
        return transfers;
    }

    return [];
};

export const selectCurrentPage = (state: RootState): number => state.user.history.page;

export const selectFirstElemIndex = (state: RootState, limit: number): number => state.user.history.page * limit + 1;

export const selectLastElemIndex = (state: RootState, limit: number): number => {
    const { deposits, withdraws, trades, transfers } = state.user.history;
    const length = deposits.length || withdraws.length || trades.length || transfers.length;

    return state.user.history.page * limit + length;
};

export const selectNextPageExists = (state: RootState, limit: number): boolean => state.user.history.nextPageExists;

export const selectHistoryLoading = (state: RootState): boolean => state.user.history.fetching;
