export interface Currency {
    id: string;
    name: string;
    symbol: string;
    type: string;
    precision: number;
    icon_url: string;
    blockchain_currencies: BlockchainCurrencies[];
}

export interface BlockchainCurrencies {
    id: number;
    blockchain_key: string;
    protocol: string;
    currency_id: string;
    deposit_fee: string;
    min_deposit_amount: string;
    withdraw_fee: string;
    min_withdraw_amount: string;
    withdraw_limit_24h: string;
    withdraw_limit_72h: string;
    deposit_enabled: boolean;
    withdrawal_enabled: boolean;
    min_confirmations: number;
    base_factor: number;
    explorer_transaction: string;
    explorer_address: string;
    status: string;
}
