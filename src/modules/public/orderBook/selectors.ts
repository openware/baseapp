import { incrementalOrderBook } from '../../../api';
import { RootState } from '../../index';
import { DepthIncrementState, DepthState } from './types';

export const selectOrderBookLoading = (state: RootState): boolean =>
    state.public.orderBook.loading;

export const selectDepthAsks = incrementalOrderBook() ?
    (state: RootState): DepthState['asks'] => state.public.incrementDepth.asks :
    (state: RootState): DepthIncrementState['asks'] => state.public.depth.asks;

export const selectDepthBids = incrementalOrderBook() ?
    (state: RootState): DepthState['bids'] => state.public.incrementDepth.bids :
    (state: RootState): DepthIncrementState['bids'] => state.public.depth.bids;

export const selectDepthLoading = incrementalOrderBook() ?
    (state: RootState): boolean => state.public.incrementDepth.loading :
    (state: RootState): boolean => state.public.depth.loading;

export const selectOrderBookSequence = (state: RootState): number | null => state.public.incrementDepth.sequence;
