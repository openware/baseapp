import { MarketsState } from './markets/reducer';
import { OrderBookState } from './orderBook';

import { TickerEvent } from './markets';
import {
    OrderKind,
    OrdersState,
    OrderStatus,
} from './orders';

export interface CommonState {
    error?: CommonError;
    loading?: boolean;
}

interface OrderEvent {
    id: number;
    at: number;
    market: string;
    kind: OrderKind;
    price: string;
    state: OrderStatus;
    volume: string;
    origin_volume: string;
}


interface MarketUpdateEvent {
    asks: Array<[number, number]>;
    bids: Array<[number, number]>;
}

export {
    OrderEvent,
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
