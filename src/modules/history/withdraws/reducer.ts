import { CommonState } from '../../types';
import { WithdrawsActions } from './actions';
import {WITHDRAWS_DATA, WITHDRAWS_ERROR, WITHDRAWS_FETCH} from './constants';

export interface Withdraw {
    currency: string;
}

export interface WithdrawsState extends CommonState {
    list: Withdraw[];
}

const initialState: WithdrawsState = {
    list: [],
    loading: false,
};

export const withdrawsReducer = (state = initialState, action: WithdrawsActions) => {
    switch (action.type) {
        case WITHDRAWS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case WITHDRAWS_DATA:
            return {
                list: action.payload,
                loading: false,
            };
        case WITHDRAWS_ERROR: {
            return {
                list: [],
                loading: false,
                error: action.payload,
            };
        }
        default:
            return state;
    }
};
