import { CommonError } from '../../modules/types';
import { RootState } from '../index';
import { Wallet } from './types';

export const selectWallets = (state: RootState): Wallet[] =>
    state.app.wallets.wallets.list;

export const selectWalletsLoading = (state: RootState): boolean =>
    state.app.wallets.wallets.loading;

export const selectWalletsError = (state: RootState): CommonError | undefined =>
    state.app.wallets.wallets.error;

export const selectWithdrawSuccess = (state: RootState): boolean =>
    state.app.wallets.wallets.withdrawSuccess;
