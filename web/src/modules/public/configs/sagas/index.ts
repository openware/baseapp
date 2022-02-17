import { takeEvery } from 'redux-saga/effects';
import { CONFIGS_FETCH } from '../constants';
import { getConfigsSaga } from './getConfigsSaga';

export function* rootConfigsSaga() {
    yield takeEvery(CONFIGS_FETCH, getConfigsSaga);
}
