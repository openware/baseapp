import { MarketsState, TickerEvent } from './public/markets';
import { OrderBookState } from './public/orderBook';
import { OrdersState } from './user/orders';

export interface CommonState {
    error?: CommonError;
    loading?: boolean;
}

export type OrderStatus = 'wait' | 'done' | 'cancel' | 'pending' | 'reject';
export type OrderSide = 'sell' | 'buy';
export type OrderType = 'limit' | 'market';
export type OrderKind = 'bid' | 'ask';

export interface OrderCommon {
    price: number;
    created_at: string;
    state: OrderStatus;
    remaining_volume: number;
    origin_volume: number;
    executed_volume: number;
    side: OrderSide;
    market: string;
    ord_type?: OrderType;
    avg_price?: number;
    volume?: number;
    updated_at?: string;
    confirmed?: boolean;
    uuid?: string;
    id?: number;
}

/*
** example: {"id":10666,"side":"buy","ord_type":"limit","price":"0.003","avg_price":"0.003","state":"wait","market":"kyneth","created_at":"2019-02-15T09:46:21+01:00","volume":"10.0","remaining_volume":"9.9","executed_volume":"0.1","trades_count":1}
*/
export interface OrderAPI {
    side: OrderSide;
    ord_type: OrderType;
    price: string;
    state: OrderStatus;
    market: string;
    created_at: string;
    remaining_volume: string;
    executed_volume: string;
    origin_volume: string;
    avg_price: string;
    updated_at?: string;
    confirmed?: boolean;
    uuid?: string;
    id?: number;
}

/*
** example: {"order":{"id":10666,"at":1550220381,"market":"kyneth","kind":"bid","price":"0.003","state":"wait","volume":"9.9","origin_volume":"10.0"}}
*/
export interface OrderEvent {
    at: number;
    market: string;
    kind: OrderKind;
    price: string;
    state: OrderStatus;
    origin_volume: string;
    remaining_volume: string;
    ord_type?: OrderType;
    updated_at?: string;
    confirmed?: boolean;
    uuid?: string;
    id?: number;
}


export interface MarketUpdateEvent {
    asks: Array<[number, number]>;
    bids: Array<[number, number]>;
}

export type RangerEvent = TickerEvent | OrderEvent | MarketUpdateEvent;

export interface CommonError {
    code: number;
    message: string[];
}

export interface CoreState {
    orders: OrdersState;
    orderBook: OrderBookState;
    markets: MarketsState;
}

export interface ClientState {
    coreData: CoreState;
}
