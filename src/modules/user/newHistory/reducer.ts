import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { NewHistoryActions } from './actions';
import {
    NEW_HISTORY_DATA,
    NEW_HISTORY_ERROR,
    NEW_HISTORY_FETCH,
    NEW_HISTORY_RESET,
} from './constants';
import { WalletNewHistoryList } from './types';

export interface NewHistoryState {
    list: WalletNewHistoryList;
    fetching: boolean;
}

export const initialNewHistoryState: NewHistoryState = {
    list: [],
    fetching: false,
};


export const newHistoryReducer = (state = initialNewHistoryState, action: NewHistoryActions) => {
    switch (action.type) {
        case NEW_HISTORY_FETCH:
            return { ...state, fetching: true };
        case NEW_HISTORY_DATA:
            return {
                ...state,
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                fetching: false,
            };
        case NEW_HISTORY_ERROR: {
            return { ...state, error: action.payload };
        }
        case NEW_HISTORY_RESET: {
            return { ...state, list: [] };
        }
        default:
            return state;
    }
};
