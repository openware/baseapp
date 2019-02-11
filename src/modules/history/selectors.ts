import { RootState } from '../index';
import { WalletHistoryList } from './types';

export const selectHistory = (state: RootState): WalletHistoryList =>
    state.app.history.list;

export const selectFullHistory = (state: RootState): number =>
    state.app.history.fullHistory;

export const selectCurrentPage = (state: RootState): number =>
    state.app.history.page;

export const selectPageCount = (state: RootState, limit): number =>
    Math.ceil(state.app.history.fullHistory / limit);

export const selectFirstElemIndex = (state: RootState, limit): number =>
    (state.app.history.page * limit) + 1;

export const selectLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.app.history.page * limit) + limit > selectFullHistory(state)) {
        return selectFullHistory(state);
    } else {
        return (state.app.history.page * limit) + limit;
    }
};

export const selectNextPageExists = (state: RootState, limit: number): boolean =>
    (state.app.history.page + 1) < selectPageCount(state, limit);

export const selectHistoryLoading = (state: RootState): boolean =>
    state.app.history.fetching;
