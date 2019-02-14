// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { fetchError, fetchSuccess } from '../../../public/alert';
import { apiKeyCreate, ApiKeyCreateFetch, apiKeys2FAModal } from '../actions';

const createOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* apiKeyCreateSaga(action: ApiKeyCreateFetch) {
    try {
        const apiKey = yield call(API.post(createOptions), '/resource/api_keys', action.payload);
        yield put(apiKeyCreate(apiKey));
        yield put(fetchSuccess('success.api_keys.created'));
        yield put(apiKeys2FAModal({active: true, action: 'createSuccess', apiKey}));
    } catch (error) {
        yield put(fetchError(error));
        yield put(apiKeys2FAModal({active: false}));
    }
}
