// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../index';
import {
    changePasswordData,
    changePasswordError,
    ChangePasswordFetch,
} from '../actions';

const changePasswordOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* changePasswordSaga(action: ChangePasswordFetch) {
    try {
        yield call(API.put(changePasswordOptions(getCsrfToken())), '/resource/users/password', action.payload);
        yield put(changePasswordData());
        yield put(alertPush({message: ['success.password.changed'], type: 'success'}));
    } catch (error) {
        yield put(changePasswordError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
