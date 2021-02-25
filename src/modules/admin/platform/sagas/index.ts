import { takeLatest } from 'redux-saga/effects';
import { PLATFORM_CREATE } from '../constants';
import { platformCreateSaga } from './platformDataCreateSaga';

export function* rootPlatformCreateSaga() {
    yield takeLatest(PLATFORM_CREATE, platformCreateSaga);
}
