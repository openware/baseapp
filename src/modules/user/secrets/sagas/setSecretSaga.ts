import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { setSecretData, setSecretError, SetSecretFetch } from '../actions';

const requestOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio', // TODO: add sonic api
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* setSecretSaga(action: SetSecretFetch) {
    try {
        yield call(API.put(requestOptions(getCsrfToken())), '/secrets');
        yield put(setSecretData());
        yield put(alertPush({message: ['Secret successfuly created'], type: 'success'}));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: setSecretError,
            },
        }));
    }
}
