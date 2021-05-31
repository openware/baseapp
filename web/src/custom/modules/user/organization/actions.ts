import { CommonError } from '../../../../modules/types';
import {
    ORGANIZATION_ACCOUNTS_FETCH,
    ORGANIZATION_ACCOUNTS_DATA,
    ORGANIZATION_ACCOUNTS_ERROR,
    ORGANIZATION_ACCOUNT_SWITCH,
    ORGANIZATION_ACCOUNT_SWITCH_ERROR,
} from './constants';
import { OrganizationAccount } from './types';

export interface OrganizationAccountsFetch {
    type: typeof ORGANIZATION_ACCOUNTS_FETCH;
    payload?: {
        page: number;
        limit: number;
        keyword: string;
    };
}

export interface OrganizationAccountsData {
    type: typeof ORGANIZATION_ACCOUNTS_DATA;
    payload: OrganizationAccount[];
}

export interface OrganizationAccountsError {
    type: typeof ORGANIZATION_ACCOUNTS_ERROR;
    error: CommonError;
}

export interface OrganizationAccountSwitch {
    type: typeof ORGANIZATION_ACCOUNT_SWITCH;
    payload: {
        oid: string,
    };
}

export interface OrganizationAccountSwitchError {
    type: typeof ORGANIZATION_ACCOUNT_SWITCH_ERROR;
    error: CommonError;
}

export type OrganizationActions =
    OrganizationAccountsFetch
    | OrganizationAccountsData
    | OrganizationAccountsError
    | OrganizationAccountSwitch
    | OrganizationAccountSwitchError;

export const organizationAccountsFetch = (payload?: OrganizationAccountsFetch['payload']): OrganizationAccountsFetch => ({
    type: ORGANIZATION_ACCOUNTS_FETCH,
    payload,
});

export const organizationAccountsData = (payload: OrganizationAccountsData['payload']): OrganizationAccountsData => ({
    type: ORGANIZATION_ACCOUNTS_DATA,
    payload,
});

export const organizationAccountsError = (error: CommonError): OrganizationAccountsError => ({
    type: ORGANIZATION_ACCOUNTS_ERROR,
    error,
});

export const organizationAccountSwitch = (payload?: OrganizationAccountSwitch['payload']): OrganizationAccountSwitch => ({
    type: ORGANIZATION_ACCOUNT_SWITCH,
    payload,
});

export const organizationAccountSwitchError = (error: CommonError): OrganizationAccountSwitchError => ({
    type: ORGANIZATION_ACCOUNT_SWITCH_ERROR,
    error,
});