export interface Market {
    name: string;
    id: string;
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
