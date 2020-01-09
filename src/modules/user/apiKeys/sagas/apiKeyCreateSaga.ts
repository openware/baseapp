// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import { apiKeyCreate, ApiKeyCreateFetch, apiKeys2FAModal } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* apiKeyCreateSaga(action: ApiKeyCreateFetch) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const apiKey = yield call(API.post(createOptions(currentCsrfToken)), '/resource/api_keys', action.payload);
        yield put(apiKeyCreate(apiKey));
        yield put(alertPush({message: ['success.api_keys.created'], type: 'success'}));
        yield put(apiKeys2FAModal({active: true, action: 'createSuccess', apiKey}));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
        yield put(apiKeys2FAModal({active: false}));
    }
}
