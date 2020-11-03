import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { EMAIL_VERIFICATION_FETCH } from '../constants';
import { emailVerificationSaga } from './emailVerificationSaga';

export function* rootEmailVerificationSaga(): SagaIterator {
    yield takeLatest(EMAIL_VERIFICATION_FETCH, emailVerificationSaga);
}
