import { RootState } from '../index';
import { CommonError } from '../types';
import { MarketsState } from './reducer';
import { Market } from './types';

const selectMarketsState = (state: RootState): MarketsState => state.app.markets;

export const selectMarkets = (state: RootState): Market[] =>
    selectMarketsState(state).list;

export const selectHashMarkets = (state: RootState): { [pair: string]: Market } => {
    const data = {};
    for (const market of selectMarkets(state)) {
        data[market.id] = market;
    }
    return data;
};

export const selectMarketsLoading = (state: RootState): boolean | undefined =>
    selectMarketsState(state).loading;

export const selectMarketsError = (state: RootState): CommonError | undefined =>
    selectMarketsState(state).error;

export const selectCurrentMarket = (state: RootState): Market | undefined =>
    selectMarketsState(state).currentMarket;

export const selectMarketTickers = (state: RootState): MarketsState['tickers'] =>
    selectMarketsState(state).tickers;
