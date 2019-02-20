// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { pushAlertError, pushAlertSuccess } from '../../../../public/alert';
import { resendCodeData, resendCodeError, ResendCodeFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* resendCodeSaga(action: ResendCodeFetch) {
    try {
        yield call(API.post(sessionsConfig), '/resource/phones/send_code', action.payload);
        yield put(resendCodeData());
        yield put(pushAlertSuccess('success.phone.verification.send'));
    } catch (error) {
        yield put(resendCodeError(error));
        yield put(pushAlertError(error));
    }
}
