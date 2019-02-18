import { RootState } from '../../index';
import { WalletHistoryList } from './types';

export const selectHistory = (state: RootState): WalletHistoryList =>
    state.user.history.list;

export const selectFullHistory = (state: RootState): number =>
    state.user.history.fullHistory;

export const selectCurrentPage = (state: RootState): number =>
    state.user.history.page;

export const selectPageCount = (state: RootState, limit): number =>
    Math.ceil(state.user.history.fullHistory / limit);

export const selectFirstElemIndex = (state: RootState, limit): number =>
    (state.user.history.page * limit) + 1;

export const selectLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.user.history.page * limit) + limit > selectFullHistory(state)) {
        return selectFullHistory(state);
    } else {
        return (state.user.history.page * limit) + limit;
    }
};

export const selectNextPageExists = (state: RootState, limit: number): boolean =>
    (state.user.history.page + 1) < selectPageCount(state, limit);

export const selectHistoryLoading = (state: RootState): boolean =>
    state.user.history.fetching;
