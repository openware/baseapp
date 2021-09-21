export type MarketId = string;

export interface MarketFilterCustomStepRule {
    limit: string;
    step: string;
}

export interface MarketFilterCustomStep {
    type: string;
    rules: MarketFilterCustomStepRule[];
}

export interface MarketFilterSignificantDigit {
    type: string;
    digits: number;
}

export type MarketFilter = MarketFilterSignificantDigit | MarketFilterCustomStep;

export type MarketFeature = {
    order_types: string[];
}

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
    filters?: MarketFilter[];
    features?: MarketFeature;
}

export interface Ticker {
    amount: string;
    avg_price: string;
    high: string;
    last: string;
    low: string;
    open: number | string;
    price_change_percent: string;
    volume: string;
}

export interface TickerEvent {
    amount: string;
    name: string;
    base_unit: string;
    quote_unit: string;
    low: string;
    high: string;
    open: number;
    last: string;
    avg_price: string;
    price_change_percent: string;
    volume: string;
    at: number;
}

export interface MarketPriceInterface {
    price: string;
    created_at: string;
    updated_at: string;
}
