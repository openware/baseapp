import { CommonError } from '../../types';
import { P2PDisputeActions } from './actions';
import {
    P2P_DISPUTE_DATA,
    P2P_DISPUTE_ERROR,
    P2P_DISPUTE_FETCH,
} from './constants';

export interface P2PDisputeState {
    fetching: boolean;
    success: boolean;
    error?: CommonError;
}

const initialState: P2PDisputeState = {
    fetching: false,
    success: false,
};

export const p2pDisputeReducer = (state = initialState, action: P2PDisputeActions) => {
    switch (action.type) {
        case P2P_DISPUTE_FETCH:
            return { ...state, fetching: true };
        case P2P_DISPUTE_DATA:
            return {
                ...state,
                success: true,
                fetching: false,
            };
        case P2P_DISPUTE_ERROR: {
            return {
                ...state,
                error: action.error,
                fetching: false,
                success: false,
            };
        }
        default:
            return state;
    }
};
