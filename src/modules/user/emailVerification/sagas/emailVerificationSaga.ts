// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    pushAlertError,
    pushAlertSuccess,
} from '../../../public/alert';
import {
    emailVerificationData,
    emailVerificationError,
    EmailVerificationFetch,
} from '../actions';


const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* emailVerificationSaga(action: EmailVerificationFetch) {
    try {
        yield call(API.post(sessionsConfig), '/identity/users/email/generate_code', {
            email: action.payload.email,
            lang: action.payload.lang,
        });
        yield put(emailVerificationData());
        yield put(pushAlertSuccess('success.message.sent'));
    } catch (error) {
        yield put(emailVerificationError(error));
        yield put(pushAlertError(error));
    }
}
