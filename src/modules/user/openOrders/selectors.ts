import { RootState } from '../../';
import { OrderCommon } from '../../types';

export const selectOpenOrdersList = (state: RootState): OrderCommon[] =>
    state.user.openOrders.list;

export const selectOpenOrdersFetching = (state: RootState): boolean =>
    state.user.openOrders.fetching;

export const selectCancelOpenOrdersFetching = (state: RootState): boolean =>
    state.user.openOrders.cancelFetching;
