export interface Currency {
    id: string;
    name: string;
    symbol: string;
    explorer_transaction: string;
    explorer_address: string;
    type: string;
    deposit_fee: string;
    min_confirmations: number;
    min_deposit_amount: string;
    withdraw_fee: string;
    min_withdraw_amount: string;
    withdraw_limit_24h: string;
    withdraw_limit_72h: string;
    deposit_enabled: boolean;
    withdrawal_enabled: boolean;
    base_factor: number;
    precision: number;
    icon_url: string;
    blockchain_currencies: BlockchainCurrencies[];
}

interface BlockchainCurrencies {
    id: number;
    blockchain_key: string;
    currency_id: string;
    deposit_fee: string;
    min_deposit_amount: string;
    withdraw_fee: string;
    min_withdraw_amount: string;
    withdraw_limit_24h: string;
    withdraw_limit_72h: string;
    deposit_enabled: boolean;
    withdraw_enabled: boolean;
    base_factor: number;
    status: string;
}
