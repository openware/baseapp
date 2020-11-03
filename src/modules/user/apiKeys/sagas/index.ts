import { SagaIterator } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

import { API_KEY_CREATE_FETCH, API_KEY_DELETE_FETCH, API_KEY_UPDATE_FETCH, API_KEYS_FETCH } from '../constants';
import { apiKeyCreateSaga } from './apiKeyCreateSaga';
import { apiKeyDeleteSaga } from './apiKeyDeleteSaga';
import { apiKeysSaga } from './apiKeysSaga';
import { apiKeyUpdateSaga } from './apiKeyUpdateSaga';

export function* rootApiKeysSaga(): SagaIterator {
    yield takeEvery(API_KEYS_FETCH, apiKeysSaga);
    yield takeEvery(API_KEY_CREATE_FETCH, apiKeyCreateSaga);
    yield takeEvery(API_KEY_UPDATE_FETCH, apiKeyUpdateSaga);
    yield takeEvery(API_KEY_DELETE_FETCH, apiKeyDeleteSaga);
}
