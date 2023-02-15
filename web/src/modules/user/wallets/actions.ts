import { CommonError } from '../../types';
import {
    P2P_WALLETS_DATA,
    P2P_WALLETS_DATA_WS,
    P2P_WALLETS_ERROR,
    P2P_WALLETS_FETCH,
    SET_MOBILE_WALLET_UI,
    WALLETS_ADDRESS_DATA,
    WALLETS_ADDRESS_DATA_WS,
    WALLETS_ADDRESS_ERROR,
    WALLETS_ADDRESS_FETCH,
    WALLETS_DATA,
    WALLETS_DATA_WS,
    WALLETS_ERROR,
    WALLETS_FETCH,
    WALLETS_RESET,
    WALLETS_USER_WITHDRAWALS_DATA,
    WALLETS_USER_WITHDRAWALS_ERROR,
    WALLETS_USER_WITHDRAWALS_FETCH,
    WALLETS_WITHDRAW_CCY_DATA,
    WALLETS_WITHDRAW_CCY_ERROR,
    WALLETS_WITHDRAW_CCY_FETCH,
} from './constants';
import { Wallet, WalletAddress, WalletWithdrawCCY } from './types';

export interface UserWithdrawalsFetch {
    type: typeof WALLETS_USER_WITHDRAWALS_FETCH;
}

export interface UserWithdrawalsData {
    type: typeof WALLETS_USER_WITHDRAWALS_DATA;
    payload: {
        last_24_hours: string;
        last_1_month: string;
    };
}

export interface UserWithdrawalsError {
    type: typeof WALLETS_USER_WITHDRAWALS_ERROR;
    error: CommonError;
}

export interface WalletsFetch {
    type: typeof WALLETS_FETCH;
}

export interface WalletsData {
    type: typeof WALLETS_DATA;
    payload: Wallet[];
}

export interface WalletsDataByRanger {
    type: typeof WALLETS_DATA_WS;
    payload: {
        ws: boolean;
        balances;
    };
}

export interface WalletsError {
    type: typeof WALLETS_ERROR;
    error: CommonError;
}

export interface WalletsReset {
    type: typeof WALLETS_RESET;
}

export interface WalletsAddressFetch {
    type: typeof WALLETS_ADDRESS_FETCH;
    payload: {
        currency: string;
        blockchain_key: string;
    };
}

export interface WalletsAddressData {
    type: typeof WALLETS_ADDRESS_DATA;
    payload: WalletAddress;
}

export interface WalletsAddressDataWS {
    type: typeof WALLETS_ADDRESS_DATA_WS;
    payload: WalletAddress;
}

export interface WalletsAddressError {
    type: typeof WALLETS_ADDRESS_ERROR;
    error: CommonError;
}

export interface WalletsWithdrawCcyFetch {
    type: typeof WALLETS_WITHDRAW_CCY_FETCH;
    payload: WalletWithdrawCCY;
}

export interface WalletsWithdrawCcyData {
    type: typeof WALLETS_WITHDRAW_CCY_DATA;
}

export interface WalletsWithdrawCcyError {
    type: typeof WALLETS_WITHDRAW_CCY_ERROR;
    error: CommonError;
}

export interface SetMobileWalletUi {
    type: typeof SET_MOBILE_WALLET_UI;
    payload: string;
}

export interface P2PWalletsFetch {
    type: typeof P2P_WALLETS_FETCH;
}

export interface P2PWalletsData {
    type: typeof P2P_WALLETS_DATA;
    payload: Wallet[];
}

export interface P2PWalletsError {
    type: typeof P2P_WALLETS_ERROR;
    error: CommonError;
}

export interface P2PWalletsDataByRanger {
    type: typeof P2P_WALLETS_DATA_WS;
    payload: {
        ws: boolean;
        balances;
    };
}

export type WalletsAction =
    | WalletsFetch
    | WalletsData
    | WalletsDataByRanger
    | WalletsError
    | WalletsAddressFetch
    | WalletsAddressData
    | WalletsAddressDataWS
    | WalletsAddressError
    | WalletsWithdrawCcyFetch
    | WalletsWithdrawCcyData
    | WalletsWithdrawCcyError
    | WalletsReset
    | SetMobileWalletUi
    | P2PWalletsFetch
    | P2PWalletsData
    | P2PWalletsError
    | P2PWalletsDataByRanger
    | UserWithdrawalsFetch
    | UserWithdrawalsData
    | UserWithdrawalsError;

export const userWithdrawalsFetch = (): UserWithdrawalsFetch => ({
    type: WALLETS_USER_WITHDRAWALS_FETCH,
});

export const userWithdrawalsData = (payload: UserWithdrawalsData['payload']): UserWithdrawalsData => ({
    type: WALLETS_USER_WITHDRAWALS_DATA,
    payload,
});

export const userWithdrawalsError = (error: CommonError): UserWithdrawalsError => ({
    type: WALLETS_USER_WITHDRAWALS_ERROR,
    error,
});

export const walletsFetch = (): WalletsFetch => ({
    type: WALLETS_FETCH,
});

export const walletsData = (payload: WalletsData['payload']): WalletsData => ({
    type: WALLETS_DATA,
    payload,
});

export const updateWalletsDataByRanger = (payload: WalletsDataByRanger['payload']): WalletsDataByRanger => ({
    type: WALLETS_DATA_WS,
    payload,
});

export const walletsError = (error: CommonError): WalletsError => ({
    type: WALLETS_ERROR,
    error,
});

export const walletsAddressFetch = (payload: WalletsAddressFetch['payload']): WalletsAddressFetch => ({
    type: WALLETS_ADDRESS_FETCH,
    payload,
});

export const walletsAddressData = (payload: WalletsAddressData['payload']): WalletsAddressData => ({
    type: WALLETS_ADDRESS_DATA,
    payload,
});

export const walletsAddressError = (error: CommonError): WalletsAddressError => ({
    type: WALLETS_ADDRESS_ERROR,
    error,
});

export const walletsAddressDataWS = (payload: WalletsAddressDataWS['payload']): WalletsAddressDataWS => ({
    type: WALLETS_ADDRESS_DATA_WS,
    payload,
});

export const walletsWithdrawCcyFetch = (payload: WalletsWithdrawCcyFetch['payload']): WalletsWithdrawCcyFetch => ({
    type: WALLETS_WITHDRAW_CCY_FETCH,
    payload,
});

export const walletsWithdrawCcyData = (): WalletsWithdrawCcyData => ({
    type: WALLETS_WITHDRAW_CCY_DATA,
});

export const walletsWithdrawCcyError = (error: CommonError): WalletsWithdrawCcyError => ({
    type: WALLETS_WITHDRAW_CCY_ERROR,
    error,
});

export const walletsReset = (): WalletsReset => ({
    type: WALLETS_RESET,
});

export const setMobileWalletUi = (payload: SetMobileWalletUi['payload']): SetMobileWalletUi => ({
    type: SET_MOBILE_WALLET_UI,
    payload,
});

export const p2pWalletsFetch = (): P2PWalletsFetch => ({
    type: P2P_WALLETS_FETCH,
});

export const p2pWalletsData = (payload: P2PWalletsData['payload']): P2PWalletsData => ({
    type: P2P_WALLETS_DATA,
    payload,
});

export const p2pWalletsError = (error: CommonError): P2PWalletsError => ({
    type: P2P_WALLETS_ERROR,
    error,
});

export const updateP2PWalletsDataByRanger = (payload: P2PWalletsDataByRanger['payload']): P2PWalletsDataByRanger => ({
    type: P2P_WALLETS_DATA_WS,
    payload,
});
