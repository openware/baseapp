import { RootState } from '../../';
import { Wallet } from './types';

export const selectWallets = (state: RootState): Wallet[] =>
    state.user.wallets.wallets.list;

export const selectWalletsLoading = (state: RootState): boolean =>
    state.user.wallets.wallets.loading;

export const selectWithdrawSuccess = (state: RootState): boolean =>
    state.user.wallets.wallets.withdrawSuccess;

export const selectWalletsTimestamp = (state: RootState): number | undefined =>
    state.user.wallets.wallets.timestamp;

export const selectMobileWalletUi = (state: RootState): string =>
    state.user.wallets.wallets.mobileWalletChosen;

export const selectShouldFetchWallets = (state: RootState): boolean =>
    (!selectWalletsTimestamp(state) || !selectWallets(state).length) && !selectWalletsLoading(state);

export const selectP2PWalletsLoading = (state: RootState): boolean =>
    state.user.wallets.p2pWallets.loading;

export const selectP2PWalletsTimestamp = (state: RootState): number | undefined =>
    state.user.wallets.p2pWallets.timestamp;

export const selectShouldFetchP2PWallets = (state: RootState): boolean =>
    !selectP2PWalletsTimestamp(state) && !selectP2PWalletsLoading(state);

export const selectP2PWallets = (state: RootState): Wallet[] =>
    state.user.wallets.p2pWallets.list;

export const selectUserWithdrawalLimitsMonth = (state: RootState): string =>
    state.user.wallets.userWithdrawals.last_1_month;

export const selectUserWithdrawalLimitsDay = (state: RootState): string =>
    state.user.wallets.userWithdrawals.last_24_hours;

export const selectUserWithdrawalLimitsLoading = (state: RootState): boolean =>
    state.user.wallets.userWithdrawals.loading;

export const selectUserWithdrawlLimitsTimestamp = (state: RootState): number | undefined =>
    state.user.wallets.userWithdrawals.timestamp;

export const selectShouldFetchWithdrawalLimits = (state: RootState): boolean =>
    !selectUserWithdrawlLimitsTimestamp(state) && !selectUserWithdrawalLimitsLoading(state);
