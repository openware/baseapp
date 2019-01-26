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

export interface TickerEvent {
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
