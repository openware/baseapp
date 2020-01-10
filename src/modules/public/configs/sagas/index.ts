// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { CONFIGS_FETCH } from '../constants';
import { configsFetchSaga } from './configsFetchSaga';

export function* rootConfigsSaga() {
    yield takeLatest(CONFIGS_FETCH, configsFetchSaga);
}
