import { RootState } from '../../index';
import { WalletHistoryList } from './types';

export const selectHistory = (state: RootState): WalletHistoryList =>
    state.user.history.list;

export const selectHistoryTotal = (state: RootState): number =>
    state.user.history.total;

export const selectCurrentPage = (state: RootState): number =>
    state.user.history.page;

export const selectPageCount = (state: RootState, limit): number =>
    Math.ceil(state.user.history.total / limit);

export const selectFirstElemIndex = (state: RootState, limit): number =>
    (state.user.history.page * limit) + 1;

export const selectLastElemIndex = (state: RootState, limit: number): number => {
    if (state.user.history.total >= 0) {
        if ((state.user.history.page * limit) + limit > selectHistoryTotal(state)) {
            return selectHistoryTotal(state);
        } else {
            return (state.user.history.page * limit) + limit;
        }
    } else {
        return (state.user.history.page * limit) + state.user.history.list.length;
    }
};

export const selectNextPageExists = (state: RootState, limit: number): boolean => {
    if (state.user.history.total >= 0) {
        return (state.user.history.page + 1) < selectPageCount(state, limit);
    } else {
        return state.user.history.list.length === limit;
    }
};

export const selectHistoryLoading = (state: RootState): boolean =>
    state.user.history.fetching;
