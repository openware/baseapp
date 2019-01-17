// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../api';
import {
    changePasswordData,
    changePasswordError,
    ChangePasswordFetch,
} from '../actions';

const changePasswordOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* changePasswordSaga(action: ChangePasswordFetch) {
    try {
        yield call(API.put(changePasswordOptions), '/resource/users/password', action.payload);
        yield put(changePasswordData());
    } catch (error) {
        yield put(changePasswordError(error));
    }
}
