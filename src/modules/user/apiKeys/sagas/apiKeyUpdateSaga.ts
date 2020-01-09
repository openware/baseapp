// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import { apiKeys2FAModal, apiKeyUpdate, ApiKeyUpdateFetch } from '../actions';

const updateOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* apiKeyUpdateSaga(action: ApiKeyUpdateFetch) {
    try {
        const {totp_code} = action.payload;
        const {kid, state} = action.payload.apiKey;
        const currentCsrfToken = yield getCsrfToken();
        const updatedApiKey = yield call(API.patch(updateOptions(currentCsrfToken)), `/resource/api_keys/${kid}`, {totp_code, state});
        yield put(apiKeyUpdate(updatedApiKey));
        yield put(alertPush({message: ['success.api_keys.updated'], type: 'success'}));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}
