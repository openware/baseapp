import { RootState } from '../../index';
import { selectCurrentMarket } from '../../markets';
import { CommonError } from '../../types';
import { PrivateTrade } from './types';

export const selectTrades = (state: RootState): PrivateTrade[] =>
    state.app.trades.list;

export const selectTradesLoading = (state: RootState): boolean | undefined =>
    state.app.trades.loading;

export const selectTradesError = (state: RootState): CommonError | undefined =>
    state.app.trades.error;

export const selectTradesOfCurrentMarket = (state: RootState): PrivateTrade[] => {
    const market = selectCurrentMarket(state);
    return market ? selectTrades(state).filter(value => value.market === market.id) : [];
};
