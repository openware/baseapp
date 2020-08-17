import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { signInRequire2FA } from '../../auth';
import { resetHistory } from '../../history';
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
        localStorage.removeItem('csrfToken');
        yield put(userOpenOrdersReset());
        yield put(signInRequire2FA({ require2fa: false }));
        yield put(resetHistory());
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: logoutError,
            },
        }));
    }
}
