export interface OrderIEOData {
    id: number;
    sale_name: string;
    sale_pair_id: number;
    uid: string;
    contribution: string;
    executed: string;
    refunded: string;
    tokens_received: string;
    commission_rate: string;
    commission_amount: string;
    state: string;
    created_at: string;
    updated_at: string;
    tokens_ordered: string;
    ratio?: string;
    base_currency: string;
    quote_currency: string;
}
