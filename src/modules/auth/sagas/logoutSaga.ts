// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import { userReset } from '../../profile';
import { walletsReset } from '../../wallets';
import { logoutError, LogoutFetch } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* logoutSaga(action: LogoutFetch) {
    try {
        yield call(API.delete(requestOptions), '/identity/sessions');
        yield put(walletsReset());
        yield put(userReset());
    } catch (error) {
        yield put(logoutError(error));
    }
}
