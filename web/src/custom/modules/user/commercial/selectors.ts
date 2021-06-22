import { RootState } from '../../../../modules';
import { CommonError } from '../../../../modules/types';
import { CommercialAccount } from './types';

export const selectCommercialAccounts = (state: RootState): CommercialAccount[] =>
    state.user.commercial.accounts.data;

export const selectCommercialAccountsLoading = (state: RootState): boolean =>
    state.user.commercial.accounts.fetching;

export const selectCommercialAccountsSuccess = (state: RootState): boolean =>
    state.user.commercial.accounts.success;

export const selectCommercialAccountsError = (state: RootState): CommonError | undefined =>
    state.user.commercial.accounts.error;
