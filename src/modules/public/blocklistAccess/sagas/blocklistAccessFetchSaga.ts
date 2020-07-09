import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../alert';
import {
    sendAccessTokenData,
    sendAccessTokenError,
    SendAccessTokenFetch,
    setBlocklistStatus,
} from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* blocklistAccessFetchSaga(action: SendAccessTokenFetch) {
    try {
        yield call(API.post(requestOptions), '/identity/users/access', action.payload);
        yield put(sendAccessTokenData());
        yield put(setBlocklistStatus({ status: 'allowed' }));
    } catch (error) {
        yield put(sendAccessTokenError());
        yield put(alertPush({
            message: error.message,
            code: error.code,
            type: 'error',
        }));
    }
}
