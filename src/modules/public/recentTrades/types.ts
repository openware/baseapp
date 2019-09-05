export interface PublicTradeEvent {
    tid: number;
    taker_type: 'buy' | 'sell';
    date: number;
    price: string;
    amount: string;
    total: string;
}
