import { SendAccessTokenAction } from './actions';
import {
    SEND_BLOCKLIST_ACCESS_TOKEN_DATA,
    SEND_BLOCKLIST_ACCESS_TOKEN_ERROR,
    SEND_BLOCKLIST_ACCESS_TOKEN_FETCH,
} from './constants';

export interface BlocklistAccessState {
    loading: boolean;
    error: boolean;
    success: boolean;
}

export const initialBlocklistAccessState: BlocklistAccessState = {
    loading: false,
    error: false,
    success: false,
};

export const blocklistAccessReducer = (state = initialBlocklistAccessState, action: SendAccessTokenAction) => {
    switch (action.type) {
        case SEND_BLOCKLIST_ACCESS_TOKEN_FETCH:
            return {
                ...initialBlocklistAccessState,
                loading: true,
            };
        case SEND_BLOCKLIST_ACCESS_TOKEN_DATA:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case SEND_BLOCKLIST_ACCESS_TOKEN_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
            };
        default:
            return state;
    }
};
