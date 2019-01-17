// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { SEND_EMAIL_FETCH } from '../constants';
import { sendEmailSaga } from './sendEmailSaga';

export function* rootSendEmailSaga() {
    yield takeLatest(SEND_EMAIL_FETCH, sendEmailSaga);
}
