// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';
import {
    fetchError,
    fetchSuccess,
} from '../../';
import { API, RequestOptions } from '../../../api';
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
            email: action.email,
        });
        yield put(emailVerificationData());
        yield put(fetchSuccess('Message sent successfully'));
    } catch (error) {
        yield put(emailVerificationError(error));
        yield put(fetchError(error));
    }
}
