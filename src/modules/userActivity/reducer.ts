import { CommonError } from '../types';
import { UserActivityAction, UserActivityDataInterface } from './actions';
import {
    USER_ACTIVITY_DATA,
    USER_ACTIVITY_ERROR,
    USER_ACTIVITY_FETCH,
} from './constants';


export interface UserActivityState {
    loading: boolean;
    userActivity?: UserActivityDataInterface[];
    error?: CommonError;
}

export const initialUserActivityState: UserActivityState = {
    loading: false,
};

export const userActivityReducer = (state = initialUserActivityState, action: UserActivityAction) => {
    switch (action.type) {
        case USER_ACTIVITY_FETCH:
            return {
                ...state,
                loading: true,
            };
        case USER_ACTIVITY_DATA:
            return {
                ...state,
                userActivity: action.payload as UserActivityDataInterface[],
                loading: false,
            };
        case USER_ACTIVITY_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
