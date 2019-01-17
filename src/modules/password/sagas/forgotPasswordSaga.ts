// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import { forgotPasswordError, ForgotPasswordFetch, forgotPasswordRequireVerification } from '../actions';

const forgotPasswordConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* forgotPasswordSaga(action: ForgotPasswordFetch) {
    try {
        yield call(API.post(forgotPasswordConfig), '/users/password/generate_code', action.payload);
        yield put(forgotPasswordRequireVerification({ forgotPasswordRequireVerification: true }));
    } catch (error) {
        yield put(forgotPasswordError(error));
    }
}
