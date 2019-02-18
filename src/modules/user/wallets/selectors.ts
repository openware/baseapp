import { RootState } from '../../';
import { CommonError } from '../../../modules/types';
import { Wallet } from './types';

export const selectWallets = (state: RootState): Wallet[] =>
    state.user.wallets.wallets.list;

export const selectWalletsLoading = (state: RootState): boolean =>
    state.user.wallets.wallets.loading;

export const selectWalletsError = (state: RootState): CommonError | undefined =>
    state.user.wallets.wallets.error;

export const selectWithdrawSuccess = (state: RootState): boolean =>
    state.user.wallets.wallets.withdrawSuccess;
