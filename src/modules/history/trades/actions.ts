import { CommonError } from '../../types';
import {TRADES_DATA, TRADES_ERROR, TRADES_FETCH} from './constants';
import { Trade } from './reducer';

export interface TradesFetch {
    type: typeof TRADES_FETCH;
}

export interface TradesError {
    type: typeof TRADES_ERROR;
    payload: CommonError;
}

export interface TradesData {
    type: typeof TRADES_DATA;
    payload: Trade[];
}

export type TradesActions = TradesFetch | TradesData | TradesError;

export const trades = (): TradesFetch => ({
    type: TRADES_FETCH,
});
