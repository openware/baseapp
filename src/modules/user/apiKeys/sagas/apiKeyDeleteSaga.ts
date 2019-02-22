// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { pushAlertError, pushAlertSuccess } from '../../../public/alert';
import { apiKeyDelete, ApiKeyDeleteFetch, apiKeys2FAModal } from '../actions';

const deleteOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* apiKeyDeleteSaga(action: ApiKeyDeleteFetch) {
    try {
        const {kid, totp_code} = action.payload;
        yield call(API.delete(deleteOptions), `/resource/api_keys/${kid}?totp_code=${totp_code}`);
        yield put(apiKeyDelete({kid}));
        yield put(pushAlertSuccess('success.api_keys.deleted'));
    } catch (error) {
        yield put(pushAlertError(error));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}
