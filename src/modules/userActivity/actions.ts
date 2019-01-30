import { CommonError } from '../types';
import {
    USER_ACTIVITY_DATA,
    USER_ACTIVITY_ERROR,
    USER_ACTIVITY_FETCH,
} from './constants';

export interface UserActivityDataInterface {
    id: number;
    user_id: number;
    user_ip: string;
    user_agent: string;
    topic: string;
    action: string;
    result: string;
    data: null;
    created_at: string;
}

export interface UserActivityFetch {
    type: typeof USER_ACTIVITY_FETCH;
}

export interface UserActivityData {
    type: typeof USER_ACTIVITY_DATA;
    payload: UserActivityDataInterface[];
}

export interface UserActivityError {
    type: typeof USER_ACTIVITY_ERROR;
    payload: CommonError;
}

export type UserActivityAction =
    UserActivityFetch
    | UserActivityData
    | UserActivityError;

export const getUserActivity = (): UserActivityFetch => ({
    type: USER_ACTIVITY_FETCH,
});

export const userActivityData = (payload: UserActivityData['payload']): UserActivityData => ({
    type: USER_ACTIVITY_DATA,
    payload,
});

export const userActivityError = (payload: UserActivityError['payload']): UserActivityError => ({
    type: USER_ACTIVITY_ERROR,
    payload,
});
