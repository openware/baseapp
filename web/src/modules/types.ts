import { MarketsState, TickerEvent } from './public/markets';
import { OrderBookState } from './public/orderBook';
import { OrdersState } from './user/orders';

export interface CommonError {
    code: number;
    message: string[];
}

export interface CommonState {
    error?: CommonError;
    loading?: boolean;
}

export type OrderStatus = 'wait' | 'done' | 'cancel' | 'pending' | 'reject';
export type OrderSide = 'sell' | 'buy';
export type OrderType = 'limit' | 'market';
export type OrderKind = 'bid' | 'ask';

export interface OrderCommon {
    price: string;
    state: OrderStatus;
    remaining_volume: string;
    origin_volume: string;
    executed_volume?: string;
    side: OrderSide;
    market: string;
    ord_type?: OrderType;
    avg_price?: string;
    volume?: number;
    trigger_price?: string;
    created_at?: string;
    updated_at?: string;
    triggered_at?: string;
    confirmed?: boolean;
    uuid?: string;
    id?: number;
    kind?: OrderKind;
    trades_count?: number;
}

export interface OrderEvent extends OrderCommon {
    at: number;
    order_type?: OrderType;
}

export interface MarketUpdateEvent {
    asks: Array<[number, number]>;
    bids: Array<[number, number]>;
}

export type RangerEvent = TickerEvent | OrderEvent | MarketUpdateEvent;

export interface CoreState {
    orders: OrdersState;
    orderBook: OrderBookState;
    markets: MarketsState;
}

export interface ClientState {
    coreData: CoreState;
}
