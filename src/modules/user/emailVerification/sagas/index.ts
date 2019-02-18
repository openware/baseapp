// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import {
    SEND_EMAIL_VERIFICATION_FETCH,
} from '../constants';
import { emailVerificationSaga } from './emailVerificationSaga';

export function* rootEmailVerificationSaga() {
    yield takeLatest(SEND_EMAIL_VERIFICATION_FETCH, emailVerificationSaga);
}
