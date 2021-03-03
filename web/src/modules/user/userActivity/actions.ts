import { CommonError } from '../../types';
import { USER_ACTIVITY_DATA, USER_ACTIVITY_ERROR, USER_ACTIVITY_FETCH } from './constants';

interface UserActivityFetchPayload {
    page: number;
    limit: number;
}

export interface UserActivitySuccessPayload {
    list: UserActivityDataInterface[];
    page: number;
    total: number;
}

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
    payload: UserActivityFetchPayload;
}

export interface UserActivityData {
    type: typeof USER_ACTIVITY_DATA;
    payload: UserActivitySuccessPayload;
}

export interface UserActivityError {
    type: typeof USER_ACTIVITY_ERROR;
    error: CommonError;
}

export type UserActivityAction =
    UserActivityFetch
    | UserActivityData
    | UserActivityError;

export const getUserActivity = (payload: UserActivityFetchPayload): UserActivityFetch => ({
    type: USER_ACTIVITY_FETCH,
    payload,
});

export const userActivityData = (payload: UserActivityData['payload']): UserActivityData => ({
    type: USER_ACTIVITY_DATA,
    payload,
});

export const userActivityError = (error: CommonError): UserActivityError => ({
    type: USER_ACTIVITY_ERROR,
    error,
});
