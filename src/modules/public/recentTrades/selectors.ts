import { RootState } from '../..';
import { PublicTrade } from '../../user/history';
import { selectCurrentMarket } from '../markets';

export const selectRecentTrades = (state: RootState): PublicTrade[] => state.public.recentTrades.list;

export const selectRecentTradesOfCurrentMarket = (state: RootState): PublicTrade[] => {
    const currentMarket = selectCurrentMarket(state);

    return currentMarket
        ? state.public.recentTrades.list.filter((trade: PublicTrade) => trade.market === currentMarket.id)
        : [];
};

export const selectRecentTradesLoading = (state: RootState): boolean | undefined => state.public.recentTrades.loading;
