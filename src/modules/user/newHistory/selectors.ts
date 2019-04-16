import { RootState } from '../../index';
import { WalletNewHistoryList } from './types';

export const selectNewHistory = (state: RootState): WalletNewHistoryList =>
    state.user.newHistory.list;

export const selectNewHistoryLoading = (state: RootState): boolean =>
    state.user.newHistory.fetching;
