import { SendAccessTokenAction } from './actions';
import {
    SEND_ACCESS_TOKEN_DATA,
    SEND_ACCESS_TOKEN_ERROR,
    SEND_ACCESS_TOKEN_FETCH,
} from './constants';

export interface BlacklistAccessState {
    platformLoading: boolean;
    error: boolean;
}

export const initialBlacklistAccessState: BlacklistAccessState = {
    platformLoading: false,
    error: false,
};

export const blacklistAccessReducer = (state = initialBlacklistAccessState, action: SendAccessTokenAction) => {
    switch (action.type) {
        case SEND_ACCESS_TOKEN_FETCH:
            return {
                ...state,
                platformLoading: true,
                error: false,
            };
        case SEND_ACCESS_TOKEN_DATA:
            return {
                ...state,
                platformLoading: false,
            };
        case SEND_ACCESS_TOKEN_ERROR:
            return {
                ...state,
                platformLoading: false,
                error: true,
            };
        default:
            return state;
    }
};
