export type MarketId = string;

export interface Market {
    id: MarketId;
    name: string;
    base_unit: string;
    quote_unit: string;
    min_price: string;
    max_price: string;
    min_amount: string;
    amount_precision: number;
    price_precision: number;
    state?: string;
}

export interface Ticker {
    buy: string;
    sell: string;
    low: string;
    high: string;
    open: number | string;
    last: string;
    avg_price: string;
    price_change_percent: string;
    vol: string;
}

export interface TickerEvent {
    name: string;
    base_unit: string;
    quote_unit: string;
    buy: string;
    sell: string;
    low: string;
    high: string;
    open: number;
    last: string;
    avg_price: string;
    price_change_percent: string;
    volume: string;
    at: number;
}
