// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    userActivityData,
    UserActivityDataInterface,
    userActivityError,
    UserActivityFetch,
} from '../actions';

const userActivityOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* userActivitySaga(action: UserActivityFetch) {
    try {
        const activity = yield call(API.get(userActivityOptions), '/resource/users/activity/all');
        yield put(userActivityData(activity as UserActivityDataInterface[]));
    } catch (error) {
        yield put(userActivityError(error));
    }
}
