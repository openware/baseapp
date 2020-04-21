import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
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
    page: number;
    nextPageExists: boolean;
}

const initialState: HistoryState = {
    list: [],
    fetching: false,
    page: 0,
    nextPageExists: false,
};


export const historyReducer = (state = initialState, action: HistoryActions) => {
    switch (action.type) {
        case HISTORY_FETCH:
            return { ...state, fetching: true };
        case HISTORY_DATA:
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                fetching: false,
                page: action.payload.page,
                nextPageExists: action.payload.nextPageExists,
            };
        case HISTORY_ERROR: {
            return { ...state, list: [], fetching: false, nextPageExists: false, page: 0 };
        }
        case HISTORY_RESET: {
            return { ...state, list: [], page: 0, nextPageExists: false };
        }
        case HISTORY_PUSH_FINISH: {
            let list = [...action.payload];
            list = getUnique(list, 'id');

            return { ...state, list: sliceArray(list, defaultStorageLimit()) };
        }
        default:
            return state;
    }
};
