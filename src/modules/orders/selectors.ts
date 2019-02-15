import { RootState } from '../index';


const selectOrdersState = (state: RootState): RootState['app']['orders'] =>
    state.app.orders;

export const selectOrderExecuteLoading = (state: RootState): boolean =>
    selectOrdersState(state).executeLoading;

export const selectCurrentPrice = (state: RootState): string =>
    selectOrdersState(state).currentPrice;
