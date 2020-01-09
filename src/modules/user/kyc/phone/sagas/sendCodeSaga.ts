// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../index';
import {
    sendCodeData,
    sendCodeError,
    SendCodeFetch,
    resendCode,
} from '../actions';
import { getCsrfToken } from '../../../../../helpers';

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
        if (error.message.toString() === 'resource.phone.exists') {
            yield put(resendCode(action.payload));
            yield put(alertPush({message: error.message, type: 'success'}));
        } else {
            yield put(sendCodeError(error));
            yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
        }
    }
}
