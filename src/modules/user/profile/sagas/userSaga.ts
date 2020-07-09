import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { userData, userError } from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* userSaga() {
    try {
        const user = yield call(API.get(userOptions), '/resource/users/me');
        yield put(userData({ user }));
    } catch (error) {
        yield put(userError(error));
    }
}
