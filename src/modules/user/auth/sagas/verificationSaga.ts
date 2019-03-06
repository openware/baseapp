// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { signUpError, VerificationFetch, verificationSuccess } from '../actions';

const verificationConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* verificationSaga(action: VerificationFetch) {
    try {
        yield call(API.post(verificationConfig), '/identity/users/email/confirm_code', action.payload);
        yield put(verificationSuccess());
        yield put(alertPush({message: ['success.email.confirmed'], type: 'success'}));
    } catch (error) {
        yield put(signUpError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
