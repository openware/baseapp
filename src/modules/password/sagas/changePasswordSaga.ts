// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import { changePasswordError, ChangePasswordFetch, changePasswordSuccess } from '../actions';

const changePasswordConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* changePasswordSaga(action: ChangePasswordFetch) {
    try {
        yield call(API.post(changePasswordConfig), '/users/password/confirm_code', action.payload);
        yield put(changePasswordSuccess());
    } catch (error) {
        yield put(changePasswordError(error));
    }
}
