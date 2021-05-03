import { RootState } from '../..';
import { CommonError } from '../../types';
import { P2POrder } from './types';

// P2P Orders history
export const selectP2PTradesHistoryData = (state: RootState): P2POrder[] =>
    state.user.p2pOrders.tradesHistory.list;

export const selectP2PTradesHistoryLoading = (state: RootState): boolean =>
    state.user.p2pOrders.tradesHistory.fetching;

export const selectP2PTradesHistorySuccess = (state: RootState): boolean =>
    state.user.p2pOrders.tradesHistory.success;

export const selectP2PTradesHistoryError = (state: RootState): CommonError | undefined =>
    state.user.p2pOrders.tradesHistory.error;

export const selectP2PTradesHistoryTotalNumber = (state: RootState): number =>
    state.user.p2pOrders.tradesHistory.total;

export const selectP2PTradesHistoryCurrentPage = (state: RootState): number =>
    state.user.p2pOrders.tradesHistory.page;

export const selectP2PTradesHistoryPageCount = (state: RootState, limit): number =>
    Math.ceil(state.user.p2pOrders.tradesHistory.total / limit);

export const selectP2PTradesHistoryFirstElemIndex = (state: RootState, limit): number =>
    (state.user.p2pOrders.tradesHistory.page * limit) + 1;

export const selectP2PTradesHistoryLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.user.p2pOrders.tradesHistory.page * limit) + limit > selectP2PTradesHistoryTotalNumber(state)) {
        return selectP2PTradesHistoryTotalNumber(state);
    } else {
        return (state.user.p2pOrders.tradesHistory.page * limit) + limit;
    }
};

export const selectP2PTradesHistoryNextPageExists = (state: RootState, limit: number): boolean =>
    (state.user.p2pOrders.tradesHistory.page + 1) < selectP2PTradesHistoryPageCount(state, limit);

// P2P create order
export const selectP2PCreatedOrder = (state: RootState): P2POrder =>
    state.user.p2pOrders.order.data;

export const selectP2PCreateOrderSuccess = (state: RootState): boolean =>
    state.user.p2pOrders.order.success;

export const selectP2POrderLoading = (state: RootState): boolean =>
    state.user.p2pOrders.order.loading;

// P2P update order
export const selectP2PUpdateOrderSuccess = (state: RootState): boolean =>
    state.user.p2pOrders.order.updateSuccess;

// P2P Orders Alert list
export const selectP2POrderAlerts = (state: RootState): P2POrder[] =>
    state.user.p2pOrders.alertList.list;
