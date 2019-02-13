import { RootState } from '../index';
import { Order } from '../orders';


export const selectOrdersHistory = (state: RootState): Order[] =>
    state.app.ordersHistory.list;

export const selectTotalOrdersHistory = (state: RootState): number =>
    state.app.ordersHistory.total;

export const selectCurrentPageIndex = (state: RootState): number =>
    state.app.ordersHistory.pageIndex;

export const selectOrdersPageCount = (state: RootState, limit: number): number =>
    Math.ceil(state.app.ordersHistory.total / limit);

export const selectOrdersFirstElemIndex = (state: RootState, limit: number): number =>
    (state.app.ordersHistory.pageIndex * limit) + 1;

export const selectOrdersLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.app.ordersHistory.pageIndex * limit) + limit > selectTotalOrdersHistory(state)) {
        return selectTotalOrdersHistory(state);
    } else {
        return (state.app.ordersHistory.pageIndex * limit) + limit;
    }
};

export const selectOrdersNextPageExists = (state: RootState, limit: number): boolean =>
    (state.app.ordersHistory.pageIndex + 1) < selectOrdersPageCount(state, limit);

export const selectOrdersHistoryLoading = (state: RootState): boolean =>
    state.app.ordersHistory.fetching;
