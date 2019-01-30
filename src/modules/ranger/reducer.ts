import { RangerAction } from './actions';
import {
    RANGER_CONNECT_DATA,
    RANGER_CONNECT_ERROR,
    RANGER_CONNECT_FETCH,
    RANGER_DISCONNECT_DATA,
} from './constants';

export interface RangerState {
    withAuth: boolean;
    connected: boolean;
}

const initialRangerState: RangerState = {
    withAuth: false,
    connected: false,
};

export const rangerReducer = (state = initialRangerState, action: RangerAction): RangerState => {
    switch (action.type) {
        case RANGER_CONNECT_FETCH:
            return {
                ...state,
                withAuth: action.payload.withAuth,
                connected: false,
            };

        case RANGER_CONNECT_DATA:
            return {
                ...state,
                connected: true,
            };

        case RANGER_CONNECT_ERROR:
        case RANGER_DISCONNECT_DATA:
            return {
                ...state,
                connected: false,
            };

        default:
    }
    return state;
};
