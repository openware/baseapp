// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    LOGOUT_FETCH,
    SIGN_IN_FETCH,
    SIGN_UP_FETCH,
    VERIFICATION_FETCH,
} from '../constants';
import { logoutSaga } from './logoutSaga';
import { signInSaga } from './signInSaga';
import { signUpSaga } from './signUpSaga';
import { verificationSaga } from './verificationSaga';

export function* rootAuthSaga() {
    yield takeEvery(SIGN_IN_FETCH, signInSaga);
    yield takeEvery(SIGN_UP_FETCH, signUpSaga);
    yield takeEvery(VERIFICATION_FETCH, verificationSaga);
    yield takeEvery(LOGOUT_FETCH, logoutSaga);
}
