export interface PairIEOInterface {
    id: number;
    sale_id: number;
    quote_currency_id: string;
    price: string;
    created_at: string;
    updated_at: string;
}

export interface DataIEOInterface {
    id: number;
    name: string;
    introduction_url: string | null;
    owner_uid: string;
    currency_id: string;
    supply: string;
    low_goal: string;
    commission: string;
    min_amount: string;
    min_unit: string;
    state: string;
    collected_amount: string;
    ratio: string;
    starts_at: string;
    finishes_at: string;
    created_at: string;
    updated_at: string;
    pairs: PairIEOInterface[];
    type: string;
    tokens_ordered?: string;
}
