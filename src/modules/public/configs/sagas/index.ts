import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { CONFIGS_FETCH } from '../constants';
import { configsFetchSaga } from './configsFetchSaga';

export function* rootConfigsSaga(): SagaIterator {
    yield takeLatest(CONFIGS_FETCH, configsFetchSaga);
}
