import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { KLINE_FETCH } from '../constants';
import { handleKlineFetchSaga } from './handleKlineFetchSaga';

export function* rootKlineFetchSaga(): SagaIterator {
    yield takeLatest(KLINE_FETCH, handleKlineFetchSaga);
}
