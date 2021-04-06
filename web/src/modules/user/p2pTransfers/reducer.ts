import { CommonError } from '../../types';
import { CreateP2PTransfersActions } from './actions';
import {
    CREATE_P2P_TRANSFERS_DATA,
    CREATE_P2P_TRANSFERS_ERROR,
    CREATE_P2P_TRANSFERS_FETCH,
} from './constants';

export interface P2PTransfersState {
    fetching: boolean;
    success: boolean;
    error?: CommonError;
}

const initialState: P2PTransfersState = {
    fetching: false,
    success: false,
};

export const p2pTransfersReducer = (state = initialState, action: CreateP2PTransfersActions) => {
    switch (action.type) {
        case CREATE_P2P_TRANSFERS_FETCH:
            return { ...state, fetching: true };
        case CREATE_P2P_TRANSFERS_DATA:
            return {
                ...state,
                success: true,
                fetching: false,
            };
        case CREATE_P2P_TRANSFERS_ERROR: {
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
