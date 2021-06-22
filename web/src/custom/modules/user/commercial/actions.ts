import { CommonError } from '../../../../modules/types';
import {
    COMMERCIAL_ACCOUNTS_FETCH,
    COMMERCIAL_ACCOUNTS_DATA,
    COMMERCIAL_ACCOUNTS_ERROR,
    COMMERCIAL_ACCOUNT_SWITCH,
    COMMERCIAL_ACCOUNT_SWITCH_ERROR,
} from './constants';
import { CommercialAccount } from './types';

export interface CommercialAccountsFetch {
    type: typeof COMMERCIAL_ACCOUNTS_FETCH;
    payload?: {
        page: number;
        limit: number;
        keyword: string;
    };
}

export interface CommercialAccountsData {
    type: typeof COMMERCIAL_ACCOUNTS_DATA;
    payload: CommercialAccount[];
}

export interface CommercialAccountsError {
    type: typeof COMMERCIAL_ACCOUNTS_ERROR;
    error: CommonError;
}

export interface CommercialAccountSwitch {
    type: typeof COMMERCIAL_ACCOUNT_SWITCH;
    payload: {
        oid: string,
    };
}

export interface CommercialAccountSwitchError {
    type: typeof COMMERCIAL_ACCOUNT_SWITCH_ERROR;
    error: CommonError;
}

export type CommercialActions =
    CommercialAccountsFetch
    | CommercialAccountsData
    | CommercialAccountsError
    | CommercialAccountSwitch
    | CommercialAccountSwitchError;

export const commercialAccountsFetch = (payload?: CommercialAccountsFetch['payload']): CommercialAccountsFetch => ({
    type: COMMERCIAL_ACCOUNTS_FETCH,
    payload,
});

export const commercialAccountsData = (payload: CommercialAccountsData['payload']): CommercialAccountsData => ({
    type: COMMERCIAL_ACCOUNTS_DATA,
    payload,
});

export const commercialAccountsError = (error: CommonError): CommercialAccountsError => ({
    type: COMMERCIAL_ACCOUNTS_ERROR,
    error,
});

export const commercialAccountSwitch = (payload?: CommercialAccountSwitch['payload']): CommercialAccountSwitch => ({
    type: COMMERCIAL_ACCOUNT_SWITCH,
    payload,
});

export const commercialAccountSwitchError = (error: CommonError): CommercialAccountSwitchError => ({
    type: COMMERCIAL_ACCOUNT_SWITCH_ERROR,
    error,
});