// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import { signInRequire2FA } from '../../auth';
import { userReset } from '../../profile';
import { logoutError, LogoutFetch } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* logoutSaga(action: LogoutFetch) {
    try {
        yield call(API.delete(requestOptions), '/identity/sessions');
        yield put(userReset());
        yield put(signInRequire2FA({ require2fa: false }));
    } catch (error) {
        yield put(logoutError(error));
    }
}
