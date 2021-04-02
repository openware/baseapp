export interface P2PTradesHistory {
    created_at: string;
    side: string;
    price: number | string;
    amount: number | string;
    counterparty: number | string;
    status: string;
    quote: string;
    base: string;
}

