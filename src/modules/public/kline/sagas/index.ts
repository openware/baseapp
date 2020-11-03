import { takeLatest } from 'redux-saga/effects';

import { KLINE_FETCH } from '../constants';
import { handleKlineFetchSaga } from './handleKlineFetchSaga';

export function* rootKlineFetchSaga() {
    yield takeLatest(KLINE_FETCH, handleKlineFetchSaga);
}
