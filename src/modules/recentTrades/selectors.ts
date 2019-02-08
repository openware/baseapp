import { PublicTrade } from '../history';
import { RootState } from '../index';
import { selectCurrentMarket } from '../markets';
import { CommonError } from '../types';

export const selectRecentTrades = (state: RootState): PublicTrade[] =>
    state.app.recentTrades.list;

export const selectRecentTradesOfCurrentMarket = (state: RootState): PublicTrade[] => {
    const currentMarket = selectCurrentMarket(state);
    return currentMarket ? state.app.recentTrades.list.filter((trade: PublicTrade) => trade.market === currentMarket.id) : [];
};

export const selectRecentTradesLoading = (state: RootState): boolean | undefined =>
    state.app.recentTrades.loading;

export const selectRecentTradesError = (state: RootState): CommonError | undefined =>
    state.app.recentTrades.error;
