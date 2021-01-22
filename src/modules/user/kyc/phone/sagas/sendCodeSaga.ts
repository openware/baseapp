import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import {
    resendCode,
    sendCodeData,
    sendCodeError,
    SendCodeFetch,
} from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* sendCodeSaga(action: SendCodeFetch) {
    try {
        yield call(API.post(sessionsConfig(getCsrfToken())), '/resource/phones', action.payload);
        yield put(sendCodeData());
        yield put(alertPush({message: ['success.phone.verification.send'], type: 'success'}));
    } catch (error) {
        if (error.message.indexOf('resource.phone.exists') > -1) {
            yield put(resendCode(action.payload));
        } else {
            yield put(sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: sendCodeError,
                },
            }));
        }
    }
}
