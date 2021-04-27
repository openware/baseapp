import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { RangerAction } from './actions';
import {
    RANGER_CONNECT_DATA,
    RANGER_CONNECT_ERROR,
    RANGER_CONNECT_FETCH,
    RANGER_DISCONNECT_DATA,
    RANGER_SUBSCRIPTIONS_DATA,
} from './constants';

export interface RangerState {
    withAuth: boolean;
    withP2P: boolean;
    connected: boolean;
    connecting: boolean;
    subscriptions: string[];
    timestamp?: number;
}

const initialRangerState: RangerState = {
    withAuth: false,
    withP2P: false,
    connected: false,
    connecting: false,
    subscriptions: [],
};
export const rangerReducer = (state = initialRangerState, action: RangerAction): RangerState => {
    switch (action.type) {
        case RANGER_CONNECT_FETCH:
            return {
                ...state,
                withAuth: action.payload.withAuth,
                withP2P: action.payload.withP2P,
                connected: false,
                connecting: true,
                timestamp: Math.floor(Date.now() / 1000),
            };
        case RANGER_SUBSCRIPTIONS_DATA:
            return {
                ...state,
                subscriptions: sliceArray([...action.payload.subscriptions], defaultStorageLimit()),
            };
        case RANGER_CONNECT_DATA:
            return {
                ...state,
                connected: true,
                connecting: false,
            };

        case RANGER_CONNECT_ERROR:
        case RANGER_DISCONNECT_DATA:
            return {
                ...state,
                connected: false,
                connecting: false,
            };

        default:
    }

    return state;
};
