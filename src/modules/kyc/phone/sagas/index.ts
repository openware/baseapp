// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    RESEND_CODE_FETCH,
    SEND_CODE_FETCH,
    VERIFY_PHONE_FETCH,
} from '../constants';
import { confirmPhoneSaga } from './confirmPhoneSaga';
import { resendCodeSaga } from './resendCodeSaga';
import { sendCodeSaga } from './sendCodeSaga';

export function* rootSendCodeSaga() {
    yield takeEvery(SEND_CODE_FETCH, sendCodeSaga);
    yield takeEvery(VERIFY_PHONE_FETCH, confirmPhoneSaga);
    yield takeEvery(RESEND_CODE_FETCH, resendCodeSaga);
}
