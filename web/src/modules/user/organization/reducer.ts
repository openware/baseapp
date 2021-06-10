import { CommonError } from '../../../modules/types';
import { OrganizationActions } from './actions';
import {
    ORGANIZATION_ACCOUNTS_FETCH,
    ORGANIZATION_ACCOUNTS_DATA,
    ORGANIZATION_ACCOUNTS_ERROR,
    ORGANIZATION_ABILITIES_FETCH,
    ORGANIZATION_ABILITIES_DATA,
    ORGANIZATION_ABILITIES_ERROR,
} from './constants';
import { OrganizationAccount } from './types';

export interface OrganizationState {
    accounts: {
        data: OrganizationAccount[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
    abilities: {
        switchSession: boolean;
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
    abilities: {
        switchSession: false,
        fetching: false,
        success: false,
    },
};

export const organizationAccountsFetchReducer = (state: OrganizationState['accounts'], action: OrganizationActions) => {
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

export const organizationAbilitiesFetchReducer = (state: OrganizationState['abilities'], action: OrganizationActions) => {
    switch (action.type) {
        case ORGANIZATION_ABILITIES_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
            };
        case ORGANIZATION_ABILITIES_DATA:
            return {
                ...state,
                switchSession: action.payload,
                fetching: false,
                success: true,
            };
        case ORGANIZATION_ABILITIES_ERROR:
            return {
                ...state,
                switchSession: false,
                fetching: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export const organizationReducer = (state = initialOrganizationState, action: OrganizationActions) => {
    switch (action.type) {
        case ORGANIZATION_ACCOUNTS_FETCH:
        case ORGANIZATION_ACCOUNTS_DATA:
        case ORGANIZATION_ACCOUNTS_ERROR:
            const organizationAccountsState = { ...state.accounts };

            return {
                ...state,
                accounts: organizationAccountsFetchReducer(organizationAccountsState, action),
            };
        case ORGANIZATION_ABILITIES_FETCH:
        case ORGANIZATION_ABILITIES_DATA:
        case ORGANIZATION_ABILITIES_ERROR:
            const organizationAbilitiesState = { ...state.abilities };

            return {
                ...state,
                abilities: organizationAbilitiesFetchReducer(organizationAbilitiesState, action),
            };
        default:
            return state;
    }
};
