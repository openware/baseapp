import { Market } from '../../markets';
import { CommonError } from '../../types';
import {TRADES_DATA, TRADES_ERROR, TRADES_FETCH} from './constants';
import { Trade } from './types';

export interface TradesFetch {
    type: typeof TRADES_FETCH;
    payload: Market[];
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

export const tradesFetch = (markets: Market[]): TradesFetch => ({
    type: TRADES_FETCH,
    payload: markets,
});
