import { CommonState, OrderSide, OrderStatus, OrderType } from '../../types';

export interface OrderBookOrder {
    id: number;
    side: OrderSide;
    ord_type: OrderType;
    price: string;
    avg_price: string;
    state: OrderStatus;
    market: string;
    created_at: string;
    volume: string;
    remaining_volume: string;
    executed_volume: string;
    trades_count: number;
}

export interface OrderBookState extends CommonState {
    asks: OrderBookOrder[];
    bids: OrderBookOrder[];
    loading: boolean;
}

export interface OrderBookEntry extends CommonState {
    remaining_volume: string;
    volume: string;
}

export interface DepthState extends CommonState {
    asks: string[][];
    bids: string[][];
    loading: boolean;
}

export interface DepthIncrementState {
    asks: string[][];
    bids: string[][];
}

export interface DepthIncrementUpdateData {
    asks: string[] | null;
    bids: string[] | null;
}
