import { RootState } from '../../../../modules';
import { CommonError } from '../../../../modules/types';
import { OrganizationAccount } from './types';

export const selectOrganizationAccounts = (state: RootState): OrganizationAccount[] =>
    state.user.commercial.accounts.data;

export const selectOrganizationAccountsLoading = (state: RootState): boolean =>
    state.user.commercial.accounts.fetching;

export const selectOrganizationAccountsSuccess = (state: RootState): boolean =>
    state.user.commercial.accounts.success;

export const selectOrganizationAccountsError = (state: RootState): CommonError | undefined =>
    state.user.commercial.accounts.error;
