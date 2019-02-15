import { RootState } from '../index';
import { OrderCommon } from '../types';

export const selectOpenOrdersList = (state: RootState): OrderCommon[] =>
    state.app.openOrders.list;

export const selectOpenOrdersFetching = (state: RootState): boolean =>
    state.app.openOrders.fetching;


export const selectCancelOpenOrdersFetching = (state: RootState): boolean =>
    state.app.openOrders.cancelFetching;
