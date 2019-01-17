// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    CHANGE_PASSWORD_FETCH,
    FORGOT_PASSWORD_FETCH,
    FORGOT_PASSWORD_VERIFICATION_FETCH,
} from '../constants';
import { changePasswordSaga } from './changePasswordSaga';
import { forgotPasswordSaga } from './forgotPasswordSaga';
import { forgotPasswordVerificationSaga } from './forgotPasswordVerificationSaga';

export function* rootPasswordSaga() {
    yield takeEvery(CHANGE_PASSWORD_FETCH, changePasswordSaga);
    yield takeEvery(FORGOT_PASSWORD_FETCH, forgotPasswordSaga);
    yield takeEvery(FORGOT_PASSWORD_VERIFICATION_FETCH, forgotPasswordVerificationSaga);
}
