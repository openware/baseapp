// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import {
    ChangeForgotPasswordFetch,
    changeForgotPasswordSuccess,
    forgotPasswordError,
} from '../actions';

const changeForgotPasswordConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* changeForgotPasswordSaga(action: ChangeForgotPasswordFetch) {
    try {
        yield call(API.post(changeForgotPasswordConfig), '/identity/users/password/confirm_code', action.payload);
        yield put(changeForgotPasswordSuccess());
        yield put(alertPush({ message: 'success.password.changed.successfuly', type: 'success'}));
    } catch (error) {
        yield put(forgotPasswordError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
