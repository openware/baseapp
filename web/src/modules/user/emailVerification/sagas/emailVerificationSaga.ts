import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { emailVerificationData, emailVerificationError, EmailVerificationFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* emailVerificationSaga(action: EmailVerificationFetch) {
    try {
        yield call(API.post(sessionsConfig), '/identity/users/email/generate_code', action.payload);
        yield put(emailVerificationData());
        yield put(alertPush({ message: ['success.message.sent'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: emailVerificationError,
                },
            }),
        );
    }
}
