// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { signInRequire2FA } from '../../auth';
import { userOpenOrdersReset } from '../../openOrders';
import { userReset } from '../../profile';
import { logoutError, LogoutFetch } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* logoutSaga(action: LogoutFetch) {
    try {
        yield call(API.delete(requestOptions), '/identity/sessions');
        yield put(userReset());
        yield put(userOpenOrdersReset());
        yield put(signInRequire2FA({ require2fa: false }));
    } catch (error) {
        yield put(logoutError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
