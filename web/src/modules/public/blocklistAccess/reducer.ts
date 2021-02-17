import { SendAccessTokenAction } from './actions';
import {
    SEND_BLOCKLIST_ACCESS_TOKEN_DATA,
    SEND_BLOCKLIST_ACCESS_TOKEN_ERROR,
    SEND_BLOCKLIST_ACCESS_TOKEN_FETCH,
    SET_BLOCKLIST_STATUS,
} from './constants';

export interface BlocklistAccessState {
    loading: boolean;
    error: boolean;
    success: boolean;
    status: string;
}

export const initialBlocklistAccessState: BlocklistAccessState = {
    loading: false,
    error: false,
    success: false,
    status: 'allowed',
};

export const blocklistAccessReducer = (state = initialBlocklistAccessState, action: SendAccessTokenAction) => {
    switch (action.type) {
        case SEND_BLOCKLIST_ACCESS_TOKEN_FETCH:
            return {
                ...state,
                loading: true,
                error: false,
                success: false,
            };
        case SEND_BLOCKLIST_ACCESS_TOKEN_DATA:
            return {
                ...state,
                loading: false,
                success: true,
                status: '',
            };
        case SEND_BLOCKLIST_ACCESS_TOKEN_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
            };
        case SET_BLOCKLIST_STATUS:
            return {
                ...state,
                status: action.payload.status,
            };
        default:
            return state;
    }
};
