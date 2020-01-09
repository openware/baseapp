// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush, getCsrfToken } from '../../../../index';
import { sendIdentityData, sendIdentityError, SendIdentityFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* sendIdentitySaga(action: SendIdentityFetch) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const response = yield call(API.post(sessionsConfig(currentCsrfToken)), '/resource/profiles', action.payload);
        const defaultMessage = 'success.identity.accepted';
        const { message = defaultMessage } = response;
        yield put(sendIdentityData({ message }));
        yield put(alertPush({message: [defaultMessage], type: 'success'}));
    } catch (error) {
        yield put(sendIdentityError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
