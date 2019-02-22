// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { pushAlertError, pushAlertSuccess } from '../../../public/alert';
import { apiKeys2FAModal, apiKeysData, ApiKeysFetch } from '../actions';

const apiKeysOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* apiKeysSaga(action: ApiKeysFetch) {
    try {
        const {totp_code} = action.payload;
        const apiKeys = yield call(API.get(apiKeysOptions), `/resource/api_keys?totp_code=${totp_code}`);
        yield put(apiKeysData(apiKeys));
        yield put(pushAlertSuccess('success.api_keys.fetched'));
    } catch (error) {
        yield put(pushAlertError(error));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}
