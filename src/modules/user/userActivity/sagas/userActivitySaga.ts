// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    userActivityData,
    userActivityError,
    UserActivityFetch,
} from '../actions';

const userActivityOptions: RequestOptions = {
    apiVersion: 'barong',
    withHeaders: true,
};

export function* userActivitySaga(action: UserActivityFetch) {
    try {
        const { page, limit } = action.payload;
        const { data, headers } = yield call(API.get(userActivityOptions), `/resource/users/activity?limit=${limit}&page=${page + 1}`);
        yield put(userActivityData({ list: data, page, total: headers.total }));
    } catch (error) {
        yield put(userActivityError(error));
    }
}
