// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import {
    userData,
    userError,
} from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* userSaga() {
    try {
        const user = yield call(API.get(userOptions), '/resource/users/me');
        const payload = {
            user: user,
        };
        yield put(userData(payload));
    } catch (error) {
        yield put(userError(error));
    }
}
