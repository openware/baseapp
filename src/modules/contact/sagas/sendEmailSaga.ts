// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError } from '../../';
import { API, RequestOptions } from '../../../api';
import { sendEmailData, sendEmailError, SendEmailFetch } from '../actions';

const sendEmailConfig: RequestOptions = {
    apiVersion: 'applogic',
};

export function* sendEmailSaga(action: SendEmailFetch) {
    try {
        yield call(API.post(sendEmailConfig), '/contact', action.payload);
        yield put(sendEmailData());
    } catch (error) {
        yield put(sendEmailError(error));
        yield put(fetchError(error));
    }
}
