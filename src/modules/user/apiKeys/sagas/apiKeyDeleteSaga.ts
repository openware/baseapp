// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import { apiKeyDelete, ApiKeyDeleteFetch, apiKeys2FAModal } from '../actions';

const deleteOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* apiKeyDeleteSaga(action: ApiKeyDeleteFetch) {
    try {
        const {kid, totp_code} = action.payload;
        const currentCsrfToken = yield getCsrfToken();
        yield call(API.delete(deleteOptions(currentCsrfToken)), `/resource/api_keys/${kid}?totp_code=${totp_code}`);
        yield put(apiKeyDelete({kid}));
        yield put(alertPush({message: ['success.api_keys.deleted'], type: 'success'}));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}
