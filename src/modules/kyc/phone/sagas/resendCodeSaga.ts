// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { resendCodeError, ResendCodeFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* resendCodeSaga(action: ResendCodeFetch) {
    try {
        yield call(API.post(sessionsConfig), '/resource/phones/send_code', action.payload);
    } catch (error) {
        yield put(resendCodeError(error));
        yield put(handleError(error.code));
    }
}
