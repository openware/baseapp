import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { OrganizationAbility, OrganizationAccount } from './types';

export const selectOrganizationAccounts = (state: RootState): OrganizationAccount[] =>
    state.user.organization.accounts.data;

export const selectOrganizationAccountsLoading = (state: RootState): boolean =>
    state.user.organization.accounts.fetching;

export const selectOrganizationAccountsSuccess = (state: RootState): boolean =>
    state.user.organization.accounts.success;

export const selectOrganizationAccountsError = (state: RootState): CommonError | undefined =>
    state.user.organization.accounts.error;

export const selectOrganizationAbilities = (state: RootState): OrganizationAbility =>
    state.user.organization.abilities;