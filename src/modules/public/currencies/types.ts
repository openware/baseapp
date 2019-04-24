export interface Currency {
    id: string;
    name: string;
    symbol: string;
    explorer_transaction: string;
    explorer_address: string;
    type: string;
    deposit_fee: string;
    min_deposit_amount: string;
    withdraw_fee: string;
    min_withdraw_amount: string;
    withdraw_limit_24h: string;
    withdraw_limit_72h: string;
    base_factor: number;
    precision: number;
    icon_url: string;
}
