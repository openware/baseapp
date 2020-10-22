import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { apiKeyDelete, ApiKeyDeleteFetch, apiKeys2FAModal, apiKeysError } from '../actions';

const deleteOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* apiKeyDeleteSaga(action: ApiKeyDeleteFetch) {
    try {
        const { kid, totp_code } = action.payload;
        yield call(API.delete(deleteOptions(getCsrfToken())), `/resource/api_keys/${kid}?totp_code=${totp_code}`);
        yield put(apiKeyDelete({kid}));
        yield put(alertPush({ message: ['success.api_keys.deleted'], type: 'success' }));
        yield put(apiKeys2FAModal({ active: false }));
    } catch (error) {
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: apiKeysError,
            },
        }));
    }
}
