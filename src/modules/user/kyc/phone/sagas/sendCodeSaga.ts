// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { fetchError, fetchSuccess } from '../../../../public/alert';
import { sendCodeData, sendCodeError, SendCodeFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* sendCodeSaga(action: SendCodeFetch) {
    try {
        yield call(API.post(sessionsConfig), '/resource/phones', action.payload);
        yield put(sendCodeData());
        yield put(fetchSuccess('Verification code was sent to your phone number'));
    } catch (error) {
        yield put(sendCodeError(error));
        yield put(fetchError(error));
    }
}
