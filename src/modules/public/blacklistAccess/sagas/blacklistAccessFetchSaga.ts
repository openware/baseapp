// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import { sendAccessTokenData, sendAccessTokenError, SendAccessTokenFetch } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* blacklistAccessFetchSaga(action: SendAccessTokenFetch) {
    try {
        const response = yield call(API.post(requestOptions), '/identity/users/access', action.payload);
        yield put(sendAccessTokenData());
        if (response) {
            window.location.replace('/signin');
        }
    } catch (error) {
        yield put(sendAccessTokenError());
        yield put(alertPush({
            message: error.message,
            code: error.code,
            type: 'error',
        }));

        if (error.code === 422 && error.message[0] === 'value.taken') {
            window.location.replace('/');
        } else {
            window.location.replace('/signin');
        }
    }
}
