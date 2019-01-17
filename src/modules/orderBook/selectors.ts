import { RootState } from '../index';
import { CommonError } from '../types';
import { DepthState, OrderBookState } from './types';

export const selectOrderBookAsks =
  (state: RootState): OrderBookState['asks'] =>
    state.app.orderBook.asks.map(ask => [ ask.price, ask.remaining_volume ]);

export const selectOrderBookBids =
  (state: RootState): OrderBookState['bids'] =>
  state.app.orderBook.bids.map(bid => [ bid.price, bid.remaining_volume ]);

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
