// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { sendCodeData, sendCodeError, SendCodeFetch } from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* sendCodeSaga(action: SendCodeFetch) {
    try {
        yield call(API.post(sessionsConfig), '/resource/phones', action.payload);
        yield put(sendCodeData());
    } catch (error) {
        yield put(sendCodeError(error));
        yield put(fetchError(error));
    }
}
