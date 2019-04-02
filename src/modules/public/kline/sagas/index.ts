// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { KLINE_FETCH } from '../constants';
import { handleKlineFetchSaga } from './handleKlineFetchSaga';

export function* rootKlineFetchSaga() {
    yield takeEvery(KLINE_FETCH, handleKlineFetchSaga);
}
