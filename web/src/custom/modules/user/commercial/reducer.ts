import { CommonError } from '../../../../modules/types';
import { CommercialActions } from './actions';
import {
    COMMERCIAL_ACCOUNTS_FETCH,
    COMMERCIAL_ACCOUNTS_DATA,
    COMMERCIAL_ACCOUNTS_ERROR,
} from './constants';
import { CommercialAccount } from './types';

export interface CommercialState {
    accounts: {
        data: CommercialAccount[];
        fetching: boolean;
        success: boolean;
        error?: CommonError;
    };
}

export const initialCommercialState: CommercialState = {
    accounts: {
        data: [],
        fetching: false,
        success: false,
    },
};

export const commercialAccountsFetchReducer = (state: CommercialState['accounts'], action: CommercialActions) => {
    switch (action.type) {
        case COMMERCIAL_ACCOUNTS_FETCH:
            return {
                ...state,
                fetching: true,
                success: false,
            };
        case COMMERCIAL_ACCOUNTS_DATA:
            return {
                ...state,
                data: action.payload,
                fetching: false,
                success: true,
            };
        case COMMERCIAL_ACCOUNTS_ERROR:
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

export const commercialReducer = (state = initialCommercialState, action: CommercialActions) => {
    switch (action.type) {
        case COMMERCIAL_ACCOUNTS_FETCH:
        case COMMERCIAL_ACCOUNTS_DATA:
        case COMMERCIAL_ACCOUNTS_ERROR:
            const commercialAccountsState = { ...state.accounts };

            return {
                ...state,
                accounts: commercialAccountsFetchReducer(commercialAccountsState, action),
            };
        default:
            return state;
    }
};
