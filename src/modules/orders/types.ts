export type OrderStatus = 'wait' | 'done' | 'cancel';
export type OrderSide = 'sell' | 'buy';
export type OrderType = 'limit' | 'market';
export type OrderKind = 'bid' | 'ask';

export interface Order {
    id: number | string;
    at?: number;
    side: OrderSide;
    kind?: OrderKind;
    price: number;
    volume: number | string;
    created_at: number | string;
    state: OrderStatus;
    remaining_volume: number | string;
    origin_volume?: number;
    executed_volume?: number | string;
    trades_count?: number;
}

export interface GroupedOrders {
    wait: Order[];
    done: Order[];
    cancel: Order[];
}
