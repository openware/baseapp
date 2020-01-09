// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../index';
import { resendCodeData, resendCodeError, ResendCodeFetch } from '../actions';
import { getCsrfToken } from '../../../../../helpers';

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
        yield put(alertPush({ message: ['success.phone.verification.send'], type: 'success'}));
    } catch (error) {
        yield put(resendCodeError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
