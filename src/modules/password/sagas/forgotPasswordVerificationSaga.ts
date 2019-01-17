// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import { forgotPasswordError, ForgotPasswordVerificationFetch, forgotPasswordVerificationSuccess } from '../actions';

const forgotPasswordVerificationConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* forgotPasswordVerificationSaga(action: ForgotPasswordVerificationFetch) {
    try {
        yield call(API.post(forgotPasswordVerificationConfig), '/users/password/generate_code', action.payload);
        yield put(forgotPasswordVerificationSuccess());
    } catch (error) {
        yield put(forgotPasswordError(error));
    }
}
