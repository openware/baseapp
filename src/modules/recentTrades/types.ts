export interface PublicTradeEvent {
    tid: number;
    type: 'buy' | 'sell';
    date: number;
    price: string;
    amount: string;
}
