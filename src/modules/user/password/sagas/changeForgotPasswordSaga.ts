// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { pushAlertError, pushAlertSuccess } from '../../../public/alert';
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
        yield put(pushAlertSuccess('success.password.changed.successfuly'));
    } catch (error) {
        yield put(forgotPasswordError(error));
        yield put(pushAlertError(error));
    }
}
