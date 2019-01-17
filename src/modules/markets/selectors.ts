import { RootState } from '../index';
import { CommonError } from '../types';
import { MarketsState } from './reducer';
import { Market } from './types';

const selectMarketsState = (state: RootState): MarketsState => state.app.markets;

export const selectMarkets = (state: RootState): Market[] =>
    selectMarketsState(state).list;

export const selectMarketsLoading = (state: RootState): boolean | undefined =>
    selectMarketsState(state).loading;

export const selectMarketsError = (state: RootState): CommonError | undefined =>
    selectMarketsState(state).error;

export const selectCurrentMarket = (state: RootState): Market =>
    selectMarketsState(state).currentMarket;

export const selectMarketTickers = (state: RootState): MarketsState['tickers'] =>
    selectMarketsState(state).tickers;
