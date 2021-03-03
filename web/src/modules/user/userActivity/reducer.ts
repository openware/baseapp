import { defaultStorageLimit } from '../../../api';
import { sliceArray } from '../../../helpers';
import { CommonError } from '../../types';
import { UserActivityAction, UserActivityDataInterface } from './actions';
import { USER_ACTIVITY_DATA, USER_ACTIVITY_ERROR, USER_ACTIVITY_FETCH } from './constants';

export interface UserActivityState {
    loading: boolean;
    page: number;
    total: number;
    list: UserActivityDataInterface[];
    error?: CommonError;
}

export const initialUserActivityState: UserActivityState = {
    list: [],
    loading: false,
    page: 0,
    total: 0,
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
                list: sliceArray(action.payload.list, defaultStorageLimit()),
                loading: false,
                page: action.payload.page,
                total: action.payload.total,
            };
        case USER_ACTIVITY_ERROR:
            return {
                ...state,
                error: action.error,
                list: [],
                loading: false,
                page: 0,
                total: 0,
            };
        default:
            return state;
    }
};
