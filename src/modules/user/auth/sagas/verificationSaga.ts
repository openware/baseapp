import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { signUpError, VerificationFetch, verificationSuccess } from '../actions';

const verificationConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* verificationSaga(action: VerificationFetch) {
    try {
        yield call(API.post(verificationConfig), '/identity/users/email/confirm_code', action.payload);
        yield put(verificationSuccess());
        yield put(alertPush({ message: ['success.email.confirmed'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: signUpError,
                },
            })
        );
    }
}
