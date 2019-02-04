import { RootState } from '../index';
import { CommonError } from '../types';
import { Order } from './types';

const selectOrdersState = (state: RootState): RootState['app']['orders'] =>
    state.app.orders;

export const selectOrders = (state: RootState): Order[] => {
    const { cancel, done, wait } = selectOrdersState(state).orders;
    return wait.concat(done).concat(cancel);
};

export const selectOpenOrders = (state: RootState): Order[] =>
    selectOrdersState(state).orders.wait;

export const selectOrderHistory = (state: RootState): Order[] => {
    const { cancel, done } = selectOrdersState(state).orders;
    return done.concat(cancel);
};

export const selectOrdersLoading = (state: RootState): boolean | undefined =>
    selectOrdersState(state).loading;

export const selectOrdersError = (state: RootState): CommonError | undefined =>
    selectOrdersState(state).error;

export const selectOrderCancelLoading = (state: RootState): boolean =>
    selectOrdersState(state).cancelLoading;

export const selectOrderCancelError = (state: RootState): CommonError | undefined =>
    selectOrdersState(state).cancelError;

export const selectOrderExecuteLoading = (state: RootState): boolean =>
    selectOrdersState(state).executeLoading;

export const selectOrderExecuteError = (state: RootState): CommonError | undefined =>
    selectOrdersState(state).executeError;

export const selectCurrentPrice =
  (state: RootState): string =>
      selectOrdersState(state).currentPrice;
