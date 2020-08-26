import { takeEvery } from 'redux-saga/effects';
import {
    PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
    PASSWORD_FORGOT_FETCH,
} from '../constants';
import { changeForgotPasswordSaga } from './changeForgotPasswordSaga';
import { forgotPasswordSaga } from './forgotPasswordSaga';

export function* rootPasswordSaga() {
    yield takeEvery(PASSWORD_FORGOT_FETCH, forgotPasswordSaga);
    yield takeEvery(PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH, changeForgotPasswordSaga);
}
