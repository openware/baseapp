export interface Wallet {
    currency: string;
    name: string;
    type: 'fiat' | 'coin';
    fixed: number;
    account_type: string;
    balance?: string;
    locked?: string;
    iconUrl?: string;
    active?: boolean;
    deposit_addresses?: WalletAddress[];
    blockchain_currencies: WalletBlockchain[];
}

export interface WalletBlockchain {
    blockchain_key: string;
    protocol: string;
    explorerTransaction?: string;
    explorerAddress?: string;
    min_confirmations?: string;
    fee: number;
}

export interface WalletAddress {
    address: string;
    currencies: string[];
    state?: string;
    blockchain_key: string;
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
    account_type: string;
    balance?: string;
    locked?: string;
    deposit_address?: WalletAddress;
}
