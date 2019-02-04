import { CommonState } from '../types';

/* tslint:disable */
export interface OrderBookState extends CommonState {
  asks: any[];
  bids: any[];
  loading: boolean;
}
/* tslint:enable */

export interface OrderBookEntry extends CommonState {
  remaining_volume: string;
  volume: string;
}

export interface DepthState extends CommonState {
  asks: string[][];
  bids: string[][];
  loading: boolean;
}
