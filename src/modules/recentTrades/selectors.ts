import { PublicTrade } from '../history/trades';
import { RootState } from '../index';
import { selectCurrentMarket } from '../markets';
import { CommonError } from '../types';

export const selectRecentTrades = (state: RootState): PublicTrade[] =>
    state.app.recentTrades.list;

export const selectRecentTradesOfCurrentMarket = (state: RootState): PublicTrade[] => {
    const currentMarketId = selectCurrentMarket(state).id;
    return state.app.recentTrades.list.filter((trade: PublicTrade) => trade.market === currentMarketId);
};

export const selectRecentTradesLoading = (state: RootState): boolean | undefined =>
    state.app.recentTrades.loading;

export const selectRecentTradesError = (state: RootState): CommonError | undefined =>
    state.app.recentTrades.error;
