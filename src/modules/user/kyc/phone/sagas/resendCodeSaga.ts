import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import { resendCodeData, resendCodeError, ResendCodeFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* resendCodeSaga(action: ResendCodeFetch) {
    try {
        yield call(API.post(sessionsConfig(getCsrfToken())), '/resource/phones/send_code', action.payload);
        yield put(resendCodeData());
        yield put(alertPush({ message: ['success.phone.verification.send'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: resendCodeError,
                },
            })
        );
    }
}
