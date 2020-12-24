export interface Wallet {
    currency: string;
    name: string;
    type: 'fiat' | 'coin';
    fee: number;
    fixed: number;
    balance?: string;
    locked?: string;
    iconUrl?: string;
    explorerTransaction?: string;
    explorerAddress?: string;
    deposit_address?: WalletAddress;
    active?: boolean;
}

export interface WalletAddress {
    address: string;
    currencies: string[];
    state?: string;
}

export interface WalletWithdrawCCY {
    amount: string;
    currency: string;
    otp: string;
    beneficiary_id: string;
}

export interface WalletWithdrawFiat {
    amount: string;
    currency: string;
    currency_type: string;
    otp: string;
    beneficiary_id: string;
}

export interface AccountInterface {
    currency: string;
    balance?: string;
    locked?: string;
    deposit_address?: WalletAddress;
}
