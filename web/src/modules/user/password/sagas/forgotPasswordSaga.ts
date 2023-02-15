import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { forgotPasswordError, ForgotPasswordFetch, forgotPasswordSuccess } from '../actions';

const forgotPasswordConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* forgotPasswordSaga(action: ForgotPasswordFetch) {
    try {
        yield call(API.post(forgotPasswordConfig), '/identity/users/password/generate_code', action.payload);
        yield put(forgotPasswordSuccess());
        yield put(alertPush({ message: ['success.password.forgot'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: forgotPasswordError,
                },
            }),
        );
    }
}
