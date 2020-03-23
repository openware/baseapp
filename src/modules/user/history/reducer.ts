import { getUnique } from '../../../helpers/getUnique';
import { HistoryActions } from './actions';
import {
    HISTORY_DATA,
    HISTORY_ERROR,
    HISTORY_FETCH,
    HISTORY_PUSH_FINISH,
    HISTORY_RESET,
} from './constants';
import { WalletHistoryList } from './types';

export interface HistoryState {
    list: WalletHistoryList;
    fetching: boolean;
    total: number;
    page: number;
}

const initialState: HistoryState = {
    list: [],
    fetching: false,
    total: 0,
    page: 0,
};


export const historyReducer = (state = initialState, action: HistoryActions) => {
    switch (action.type) {
        case HISTORY_FETCH:
            return { ...state, fetching: true };
        case HISTORY_DATA:
            return {
                ...state,
                list: action.payload.list,
                fetching: false,
                page: action.payload.page,
                total: action.payload.total,
            };
        case HISTORY_ERROR: {
            return { ...state, list: [], fetching: false, total: 0, page: 0 };
        }
        case HISTORY_RESET: {
            return { ...state, list: [], total: 0, page: 0 };
        }
        case HISTORY_PUSH_FINISH: {
            let list = [...action.payload];
            list = getUnique(list, 'id');
            return { ...state, list: list };
        }
        default:
            return state;
    }
};
