import { CommonError } from '../../../modules/types';
import { OrganizationActions } from './actions';
import {
    ORGANIZATION_ACCOUNTS_FETCH,
    ORGANIZATION_ACCOUNTS_DATA,
    ORGANIZATION_ACCOUNTS_ERROR,
} from './constants';
import { OrganizationAccount } from './types';

export interface OrganizationState {
    accounts: {
        data: OrganizationAccount[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialOrganizationState: OrganizationState = {
    accounts: {
        data: [],
        fetching: false,
        success: false,
    },
};

export const commercialAccountsFetchReducer = (state: OrganizationState['accounts'], action: OrganizationActions) => {
    switch (action.type) {
        case ORGANIZATION_ACCOUNTS_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
            };
        case ORGANIZATION_ACCOUNTS_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
            };
        case ORGANIZATION_ACCOUNTS_ERROR:
            return {
                ...state,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const commercialReducer = (state = initialOrganizationState, action: OrganizationActions) => {
    switch (action.type) {
        case ORGANIZATION_ACCOUNTS_FETCH:
        case ORGANIZATION_ACCOUNTS_DATA:
        case ORGANIZATION_ACCOUNTS_ERROR:
            const commercialAccountsState = { ...state.accounts };

            return {
                ...state,
                accounts: commercialAccountsFetchReducer(commercialAccountsState, action),
            };
        default:
            return state;
    }
};
