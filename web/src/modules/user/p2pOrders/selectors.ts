import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2PTradesHistory } from './types';

export const selectP2PTradesHistoryData = (state: RootState): P2PTradesHistory[] =>
    state.user.p2pTradesHistory.list;

export const selectP2PTradesHistoryLoading = (state: RootState): boolean =>
    state.user.p2pTradesHistory.fetching;

export const selectP2PTradesHistorySuccess = (state: RootState): boolean =>
    state.user.p2pTradesHistory.success;

export const selectP2PTradesHistoryError = (state: RootState): CommonError | undefined =>
    state.user.p2pTradesHistory.error;

export const selectP2PTradesHistoryTotalNumber = (state: RootState): number =>
    state.user.p2pTradesHistory.total;

export const selectP2PTradesHistoryCurrentPage = (state: RootState): number =>
    state.user.p2pTradesHistory.page;

export const selectP2PTradesHistoryPageCount = (state: RootState, limit): number =>
    Math.ceil(state.user.p2pTradesHistory.total / limit);

export const selectP2PTradesHistoryFirstElemIndex = (state: RootState, limit): number =>
    (state.user.p2pTradesHistory.page * limit) + 1;

export const selectP2PTradesHistoryLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.user.p2pTradesHistory.page * limit) + limit > selectP2PTradesHistoryTotalNumber(state)) {
        return selectP2PTradesHistoryTotalNumber(state);
    } else {
        return (state.user.p2pTradesHistory.page * limit) + limit;
    }
};

export const selectP2PTradesHistoryNextPageExists = (state: RootState, limit: number): boolean =>
    (state.user.p2pTradesHistory.page + 1) < selectP2PTradesHistoryPageCount(state, limit);
