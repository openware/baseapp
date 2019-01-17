import { MarketsState } from './markets/reducer';
import { OrderBookState } from './orderBook';

import {
    OrdersState,
    OrderStatus,
    OrderType,
} from './orders';

export interface CommonState {
    error?: CommonError;
    loading?: boolean;
}

interface OrderEvent {
    id: string;
    at: string;
    market: string;
    kind: OrderType;
    price: number;
    state: OrderStatus;
    volume: number;
    origin_volume: number;
}

interface TickerEvent {
    name: string;
    base_unit: number;
    quote_unit: number;
    open: number;
    volume: number;
    sell: number;
    buy: number;
    at: number;
    low: number;
    high: number;
    last: number;
}

interface MarketUpdateEvent {
    asks: Array<[number, number]>;
    bids: Array<[number, number]>;
}

export {
    OrderEvent,
    TickerEvent,
    MarketUpdateEvent,
};

export type RangerEvent = TickerEvent | OrderEvent | MarketUpdateEvent;

export interface CommonError {
    code: number;
    message: string;
}

export interface CoreState {
    orders: OrdersState;
    orderBook: OrderBookState;
    markets: MarketsState;
}

export interface ClientState {
    coreData: CoreState;
}
