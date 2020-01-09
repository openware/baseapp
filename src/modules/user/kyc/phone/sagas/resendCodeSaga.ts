// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush, getCsrfToken } from '../../../../index';
import { resendCodeData, resendCodeError, ResendCodeFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* resendCodeSaga(action: ResendCodeFetch) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        yield call(API.post(sessionsConfig(currentCsrfToken)), '/resource/phones/send_code', action.payload);
        yield put(resendCodeData());
        yield put(alertPush({ message: ['success.phone.verification.send'], type: 'success'}));
    } catch (error) {
        yield put(resendCodeError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
