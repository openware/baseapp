import { Market } from '../../markets';
import { CommonError } from '../../types';
import { TRADES_DATA, TRADES_ERROR, TRADES_FETCH, TRADES_PUSH } from './constants';
import { PrivateTrade, PrivateTradeEvent } from './types';

export interface TradesFetch {
    type: typeof TRADES_FETCH;
    payload: Market[];
}

export interface TradePush {
    type: typeof TRADES_PUSH;
    payload: PrivateTradeEvent;
}

export interface TradesError {
    type: typeof TRADES_ERROR;
    payload: CommonError;
}

export interface TradesData {
    type: typeof TRADES_DATA;
    payload: PrivateTrade[];
}

export type TradesActions = TradesFetch | TradesData | TradePush | TradesError;

export const tradesFetch = (markets: Market[]): TradesFetch => ({
    type: TRADES_FETCH,
    payload: markets,
});

export const tradePush = (tradeEvent: PrivateTradeEvent): TradePush => ({
    type: TRADES_PUSH,
    payload: tradeEvent,
});

export const tradesData = (trades: PrivateTrade[]): TradesData => ({
    type: TRADES_DATA,
    payload: trades,
});

export const tradesError = (error: CommonError): TradesError => ({
    type: TRADES_ERROR,
    payload: error,
});
