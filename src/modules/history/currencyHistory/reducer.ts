import { CurrencyHistoryActions } from './actions';
import {
    HISTORY_DATA,
    HISTORY_ERROR,
    HISTORY_FETCH,
    HISTORY_RESET,
    SET_FULL_HISTORY_LENGTH,
} from './constants';

export interface CurrencyHistory {
    id: number;
    currency: string;
    amount: string;
    fee: string;
    txid: string;
    created_at: string;
    confirmations: number;
    completed_at: string;
    state: string;
}

export interface CurrencyHistoryState {
    list: CurrencyHistory[];
    fetching: boolean;
    fullHistory: number;
    page: number;
}

const initialState: CurrencyHistoryState = {
    list: [],
    fetching: false,
    fullHistory: 0,
    page: 0,
};

export const currencyHistoryReducer = (state = initialState, action: CurrencyHistoryActions) => {
    switch (action.type) {
        case HISTORY_FETCH:
            return { ...state, fetching: true };
        case HISTORY_DATA:
            return { ...state, list: action.payload.list, fetching: false, page: action.payload.page };
        case HISTORY_ERROR: {
            return { ...state, list: [], fetching: false, fullHistory: 0, page: 0 };
        }
        case HISTORY_RESET: {
            return { ...state, list: [], fullHistory: 0, page: 0 };
        }
        case SET_FULL_HISTORY_LENGTH: {
            return { ...state, fullHistory: action.payload };
        }
        default:
            return state;
    }
};
