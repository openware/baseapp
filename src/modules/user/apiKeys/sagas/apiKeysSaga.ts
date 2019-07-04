// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { apiKeys2FAModal, apiKeysData, ApiKeysFetch } from '../actions';

const apiKeysOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* apiKeysSaga(action: ApiKeysFetch) {
    try {
        const apiKeys = yield call(API.get(apiKeysOptions), '/resource/api_keys');
        yield put(apiKeysData(apiKeys));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}
