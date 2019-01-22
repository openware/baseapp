
import { Trade } from '../history/trades';
import { CommonState } from '../types';
import { RecentTradesActions } from './actions';
import {
    RECENT_TRADES_DATA,
    RECENT_TRADES_ERROR,
    RECENT_TRADES_FETCH,
} from './constants';

export interface RecentTradesState extends CommonState {
    list: Trade[];
}

const initialState: RecentTradesState = {
    list: [],
    loading: false,
};

export const recentTradesReducer = (state = initialState, action: RecentTradesActions) => {
    switch (action.type) {
        case RECENT_TRADES_DATA: {
            return {
                list: action.payload,
                loading: false,
            };
        }
        case RECENT_TRADES_ERROR: {
            return {
                list: [],
                loading: false,
                error: action.payload,
            };
        }
        case RECENT_TRADES_FETCH: {
            return {
                ...state,
                loading: true,
            };
        }
        default:
            return state;
    }
};
