import { RootState } from '../index';
import { CommonError } from '../types';
import { DepthState } from './types';

export const selectOrderBookError =
  (state: RootState): CommonError | undefined =>
    state.app.orderBook.error;

export const selectOrderBookLoading = (state: RootState): boolean =>
  state.app.orderBook.loading;

export const selectDepthAsks =
  (state: RootState): DepthState['asks'] => state.app.depth.asks;

export const selectDepthBids =
  (state: RootState): DepthState['bids'] => state.app.depth.bids;

export const selectDepthError =
  (state: RootState): CommonError | undefined =>
    state.app.depth.error;

export const selectDepthLoading = (state: RootState): boolean =>
  state.app.depth.loading;
