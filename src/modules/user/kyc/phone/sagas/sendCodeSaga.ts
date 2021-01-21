import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../../';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../../helpers';
import {
    resendCodeData,
    resendCodeError,
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
            try {
                yield call(API.post(sessionsConfig(getCsrfToken())), '/resource/phones/send_code', action.payload);
                yield put(resendCodeData());
                yield put(alertPush({ message: ['success.phone.verification.send'], type: 'success'}));
            } catch (error) {
                yield put(sendError({
                    error,
                    processingType: 'alert',
                    extraOptions: {
                        actionError: resendCodeError,
                    },
                }));
            }
        } else if (error.message.indexOf('resource.phone.number_exist') > -1) {
            yield put(alertPush({ message: error.message, type: 'success' }));
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
