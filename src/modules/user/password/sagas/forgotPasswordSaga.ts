// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { fetchError, fetchSuccess } from '../../../public/alert';
import {
    forgotPasswordError,
    ForgotPasswordFetch,
    forgotPasswordSuccess,
} from '../actions';

const forgotPasswordConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* forgotPasswordSaga(action: ForgotPasswordFetch) {
    try {
        yield call(API.post(forgotPasswordConfig), '/identity/users/password/generate_code', action.payload);
        yield put(forgotPasswordSuccess());
        yield put(fetchSuccess('Reset password link was sent to your mail'));
    } catch (error) {
        yield put(forgotPasswordError(error));
        yield put(fetchError(error));
    }
}
