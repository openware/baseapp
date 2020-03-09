// tslint:disable-next-line
import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    AUTH_LOGOUT_FETCH,
    AUTH_SIGN_IN_FETCH,
    AUTH_SIGN_UP_FETCH,
    AUTH_VERIFICATION_FETCH,
    AUTH_ENTROPY_PASSWORD_FETCH,
} from '../constants';
import { logoutSaga } from './logoutSaga';
import { signInSaga } from './signInSaga';
import { signUpSaga } from './signUpSaga';
import { verificationSaga } from './verificationSaga';
import { entropyPassword } from './entropyPassword';

export function* rootAuthSaga() {
    yield takeEvery(AUTH_SIGN_IN_FETCH, signInSaga);
    yield takeEvery(AUTH_SIGN_UP_FETCH, signUpSaga);
    yield takeEvery(AUTH_VERIFICATION_FETCH, verificationSaga);
    yield takeEvery(AUTH_LOGOUT_FETCH, logoutSaga);
    yield takeLatest(AUTH_ENTROPY_PASSWORD_FETCH, entropyPassword);
}
