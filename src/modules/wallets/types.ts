export interface Wallet {
    balance: number;
    currency: string;
    type: 'fiat' | 'coin';
    fee: number;
    address?: string;
    locked?: number;
    explorerTransaction: string;
    explorerAddress: string;
}

export interface WalletAddress {
    address: string;
    currency: string;
}

export interface WalletWithdraw {
    amount: number;
    currency: string;
    currency_type: string;
    otp: string;
    rid: string;
}
