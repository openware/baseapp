// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import {
    toggle2faData,
    toggle2faError,
    Toggle2FAFetch,
} from '../actions';

const enable2faOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* toggle2faSaga(action: Toggle2FAFetch) {
    try {
        const code = { code: action.payload.code };
        yield call(API.post(enable2faOptions), '/resource/otp/enable', code);
        yield put(toggle2faData());
        yield put(alertPush({message: 'success.otp.enabled', type: 'success'}));
    } catch (error) {
        yield put(toggle2faError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
