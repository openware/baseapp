export interface WalletNewHistoryElement {
    id: number;
    created_at: string;
    side?: string;
    type: string;
    market?: string;
    price?: number;
    amount: number;
    currency?: string;
    rid?: string;
    state?: string;
    fee: number;
    txid?: string;
}

export type WalletNewHistoryList = WalletNewHistoryElement[];
