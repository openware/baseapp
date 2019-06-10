import { RootState } from '../../index';

const selectOrdersState = (state: RootState): RootState['user']['orders'] =>
    state.user.orders;

export const selectOrderExecuteLoading = (state: RootState): boolean =>
    selectOrdersState(state).executeLoading;

export const selectCurrentPrice = (state: RootState): number | undefined =>
    selectOrdersState(state).currentPrice;

export const selectAmount = (state: RootState): string =>
    selectOrdersState(state).amount;
