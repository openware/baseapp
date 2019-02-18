import { RootState } from '../../index';
import { CommonError } from '../../types';
import { DepthState } from './types';

export const selectOrderBookError =
  (state: RootState): CommonError | undefined =>
    state.public.orderBook.error;

export const selectOrderBookLoading = (state: RootState): boolean =>
  state.public.orderBook.loading;

export const selectDepthAsks =
  (state: RootState): DepthState['asks'] => state.public.depth.asks;

export const selectDepthBids =
  (state: RootState): DepthState['bids'] => state.public.depth.bids;

export const selectDepthError =
  (state: RootState): CommonError | undefined =>
    state.public.depth.error;

export const selectDepthLoading = (state: RootState): boolean =>
  state.public.depth.loading;
