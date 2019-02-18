import { RootState } from '../../index';
import { OrderCommon } from '../../types';

export const selectOrdersHistory = (state: RootState): OrderCommon[] =>
    state.user.ordersHistory.list;

export const selectTotalOrdersHistory = (state: RootState): number =>
    state.user.ordersHistory.total;

export const selectCurrentPageIndex = (state: RootState): number =>
    state.user.ordersHistory.pageIndex;

export const selectOrdersPageCount = (state: RootState, limit: number): number =>
    Math.ceil(state.user.ordersHistory.total / limit);

export const selectOrdersFirstElemIndex = (state: RootState, limit: number): number =>
    (state.user.ordersHistory.pageIndex * limit) + 1;

export const selectOrdersLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.user.ordersHistory.pageIndex * limit) + limit > selectTotalOrdersHistory(state)) {
        return selectTotalOrdersHistory(state);
    } else {
        return (state.user.ordersHistory.pageIndex * limit) + limit;
    }
};

export const selectOrdersNextPageExists = (state: RootState, limit: number): boolean =>
    (state.user.ordersHistory.pageIndex + 1) < selectOrdersPageCount(state, limit);

export const selectOrdersHistoryLoading = (state: RootState): boolean =>
    state.user.ordersHistory.fetching;

export const selectCancelAllFetching = (state: RootState): boolean =>
    state.user.ordersHistory.cancelAllFetching;

export const selectCancelFetching = (state: RootState): boolean =>
    state.user.ordersHistory.cancelFetching;
