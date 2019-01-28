export interface Market {
    id: string;
    name: string;
    ask_unit: string;
    bid_unit: string;
    ask_fee: string;
    bid_fee: string;
    min_ask_price: string;
    max_bid_price: string;
    min_ask_amount: string;
    min_bid_amount: string;
    ask_precision: number;
    bid_precision: number;
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
