// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../index';
import {
    toggle2faData,
    toggle2faError,
    Toggle2FAFetch,
} from '../actions';
import { getCsrfToken } from '../index';

const enable2faOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* toggle2faSaga(action: Toggle2FAFetch) {
    try {
        const enable = action.payload.enable;
        const code = { code: action.payload.code};

        const currentCsrfToken = yield getCsrfToken();
        yield call(API.post(enable2faOptions(currentCsrfToken)), `/resource/otp/${enable ? 'enable' : 'disable'}`, code);
        yield put(toggle2faData());
        yield put(alertPush({message: [`success.otp.${enable ? 'enabled' : 'disabled'}`], type: 'success'}));
    } catch (error) {
        yield put(toggle2faError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
