import { CommonError } from '../../types';
import { FeeGroupAction } from './actions';
import { FEE_GROUP_DATA, FEE_GROUP_ERROR, FEE_GROUP_FETCH } from './constants';
import { FeeGroup } from './types';

export interface FeeGroupState {
    data: FeeGroup;
    loading: boolean;
    success: boolean;
    error?: CommonError;
    timestamp?: number;
}

export const initialFeeGroupState: FeeGroupState = {
    data: {
        uid: '',
        email: '',
        group: '',
    },
    loading: false,
    success: false,
};

export const feeGroupReducer = (state = initialFeeGroupState, action: FeeGroupAction): FeeGroupState => {
    switch (action.type) {
        case FEE_GROUP_FETCH:
            return {
                ...state,
                loading: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case FEE_GROUP_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                data: action.payload,
            };
        case FEE_GROUP_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        default:
            return state;
    }
};
