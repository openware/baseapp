import { RootState } from '../../';
import { FilterPrice } from '../../../filters';
import { MarketsState } from './reducer';
import { Market } from './types';

const selectMarketsState = (state: RootState): MarketsState => state.public.markets;

export const selectMarkets = (state: RootState): Market[] =>
    selectMarketsState(state).list;

export const selectMarketsLoading = (state: RootState): boolean | undefined =>
    selectMarketsState(state).loading;

export const selectMarketsTimestamp = (state: RootState): number | undefined =>
    selectMarketsState(state).timestamp;

export const selectMarketsTickersTimestamp = (state: RootState): number | undefined =>
    selectMarketsState(state).tickersTimestamp;

export const selectCurrentMarket = (state: RootState): Market | undefined =>
    selectMarketsState(state).currentMarket;

export const selectCurrentMarketFilters = (state: RootState): FilterPrice =>
    selectMarketFilters(state)[(selectCurrentMarket(state) || { id: '' }).id];

export const selectMarketTickers = (state: RootState): MarketsState['tickers'] =>
    selectMarketsState(state).tickers;

export const selectShouldFetchMarkets = (state: RootState): boolean =>
    !selectMarketsTimestamp(state) && !selectMarketsLoading(state);

export const selectShouldFetchMarketsTickers = (state: RootState): boolean =>
    !selectMarketsTickersTimestamp(state);

export const selectMarketFilters = (state: RootState): MarketsState['filters'] =>
    selectMarketsState(state).filters;
