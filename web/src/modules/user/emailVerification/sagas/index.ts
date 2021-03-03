import { takeLatest } from 'redux-saga/effects';
import {
    EMAIL_VERIFICATION_FETCH,
} from '../constants';
import { emailVerificationSaga } from './emailVerificationSaga';

export function* rootEmailVerificationSaga() {
    yield takeLatest(EMAIL_VERIFICATION_FETCH, emailVerificationSaga);
}
