// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    CHANGE_FORGOT_PASSWORD_FETCH,
    FORGOT_PASSWORD_FETCH,
} from '../constants';
import { changeForgotPasswordSaga } from './changeForgotPasswordSaga';
import { forgotPasswordSaga } from './forgotPasswordSaga';

export function* rootPasswordSaga() {
    yield takeEvery(FORGOT_PASSWORD_FETCH, forgotPasswordSaga);
    yield takeEvery(CHANGE_FORGOT_PASSWORD_FETCH, changeForgotPasswordSaga);
}
