import { RootState } from '../../';
import { CommonError } from '../../types';
import { Wallet } from './types';

export const selectWallets = (state: RootState): Wallet[] =>
    state.user.wallets.wallets.list;

export const selectWalletsLoading = (state: RootState): boolean =>
    state.user.wallets.wallets.loading;

export const selectWithdrawSuccess = (state: RootState): boolean =>
    state.user.wallets.wallets.withdrawSuccess;

export const selectWalletsAddressError = (state: RootState): CommonError | undefined =>
    state.user.wallets.wallets.error;

export const selectMobileWalletUi = (state: RootState): string =>
    state.user.wallets.wallets.mobileWalletChosen;

export const selectWalletAddress = (state: RootState): string =>
    state.user.wallets.wallets.selectedWalletAddress;
