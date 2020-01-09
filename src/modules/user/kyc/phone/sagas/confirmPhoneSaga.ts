// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../index';
import { changeUserLevel } from '../../../profile';
import {
    SendCodeFetch,
    verifyPhoneData,
    verifyPhoneError,
} from '../actions';
import { getCsrfToken } from '../../../../../helpers';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* confirmPhoneSaga(action: SendCodeFetch) {
    try {
        yield call(API.post(sessionsConfig(getCsrfToken())), '/resource/phones/verify', action.payload);
        yield put(verifyPhoneData({ message: 'success.phone.confirmation.message' }));
        yield put(changeUserLevel({ level: 2 }));
        yield put(alertPush({message: ['success.phone.confirmed'], type: 'success'}));
    } catch (error) {
        yield put(verifyPhoneError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
