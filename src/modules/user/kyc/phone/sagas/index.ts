// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {
    PHONE_RESEND_CODE_FETCH,
    PHONE_SEND_CODE_FETCH,
    PHONE_VERIFY_FETCH,
} from '../constants';
import { confirmPhoneSaga } from './confirmPhoneSaga';
import { resendCodeSaga } from './resendCodeSaga';
import { sendCodeSaga } from './sendCodeSaga';

export function* rootSendCodeSaga() {
    yield takeEvery(PHONE_SEND_CODE_FETCH, sendCodeSaga);
    yield takeEvery(PHONE_VERIFY_FETCH, confirmPhoneSaga);
    yield takeEvery(PHONE_RESEND_CODE_FETCH, resendCodeSaga);
}
