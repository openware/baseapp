import { RootState } from '../../index';
import { CommonError } from '../../types';
import { Deposit } from './reducer';

export const selectDeposits = (state: RootState): Deposit[] =>
    state.app.deposits.list;

export const selectDepositsLoading = (state: RootState): boolean | undefined =>
    state.app.deposits.loading;

export const selectDepositsError = (state: RootState): CommonError | undefined =>
    state.app.deposits.error;
