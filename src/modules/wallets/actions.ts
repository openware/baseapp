import { CommonError } from '../types';
import {
    WALLETS_ADDRESS_DATA,
    WALLETS_ADDRESS_ERROR,
    WALLETS_ADDRESS_FETCH,
    WALLETS_DATA,
    WALLETS_ERROR,
    WALLETS_FETCH,
    WALLETS_WITHDRAW_DATA,
    WALLETS_WITHDRAW_ERROR,
    WALLETS_WITHDRAW_FETCH,
} from './constants';
import { Wallet, WalletAddress, WalletWithdraw } from './types';

export interface WalletsFetch {
    type: typeof WALLETS_FETCH;
}

export interface WalletsData {
    type: typeof WALLETS_DATA;
    payload: Wallet[];
}

export interface WalletsError {
    type: typeof WALLETS_ERROR;
    payload: CommonError;
}

export interface WalletsAddressFetch {
    type: typeof WALLETS_ADDRESS_FETCH;
    payload: {
        currency: string;
    };
}

export interface WalletsAddressData {
    type: typeof WALLETS_ADDRESS_DATA;
    payload: WalletAddress;
}

export interface WalletsAddressError {
    type: typeof WALLETS_ADDRESS_ERROR;
    payload: CommonError;
}

export interface WalletsWithdrawFetch {
    type: typeof WALLETS_WITHDRAW_FETCH;
    payload: WalletWithdraw;
}

export interface WalletsWithdrawData {
    type: typeof WALLETS_WITHDRAW_DATA;
}

export interface WalletsWithdrawError {
    type: typeof WALLETS_WITHDRAW_ERROR;
    payload: CommonError;
}

export type WalletsAction = WalletsFetch
    | WalletsData
    | WalletsError
    | WalletsAddressFetch
    | WalletsAddressData
    | WalletsAddressError
    | WalletsWithdrawFetch
    | WalletsWithdrawData
    | WalletsWithdrawError;

export const walletsFetch = (): WalletsFetch => ({
    type: WALLETS_FETCH,
});

export const walletsData = (payload: WalletsData['payload']): WalletsData => ({
    type: WALLETS_DATA,
    payload,
});

export const walletsError = (payload: WalletsError['payload']): WalletsError => ({
    type: WALLETS_ERROR,
    payload,
});

export const walletsAddressFetch = (payload: WalletsAddressFetch['payload']): WalletsAddressFetch => ({
    type: WALLETS_ADDRESS_FETCH,
    payload,
});

export const walletsAddressData = (payload: WalletsAddressData['payload']): WalletsAddressData => ({
    type: WALLETS_ADDRESS_DATA,
    payload,
});

export const walletsAddressError = (payload: WalletsAddressError['payload']): WalletsAddressError => ({
    type: WALLETS_ADDRESS_ERROR,
    payload,
});

export const walletsWithdrawFetch = (payload: WalletsWithdrawFetch['payload']): WalletsWithdrawFetch => ({
    type: WALLETS_WITHDRAW_FETCH,
    payload,
});

export const walletsWithdrawData = (): WalletsWithdrawData => ({
    type: WALLETS_WITHDRAW_DATA,
});

export const walletsWithdrawError = (payload: WalletsWithdrawError['payload']): WalletsWithdrawError => ({
    type: WALLETS_WITHDRAW_ERROR,
    payload,
});
