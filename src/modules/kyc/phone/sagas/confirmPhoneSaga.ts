// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import {
    SendCodeFetch,
    verifyPhoneData,
    verifyPhoneError,
} from '../actions';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* confirmPhoneSaga(action: SendCodeFetch) {
    try {
        const { message } = yield call(API.post(sessionsConfig), '/resource/phones/verify', action.payload);
        yield put(verifyPhoneData({ message }));
    } catch (error) {
        yield put(verifyPhoneError(error));
        yield put(fetchError(error));
    }
}
