import { SET_SECRET_SAGA_FETCH } from '../constants';
import { takeLatest } from 'redux-saga/effects';
import { setSecretSaga } from './setSecretSaga';

export function* rootSecretsSaga() {
    yield takeLatest(SET_SECRET_SAGA_FETCH, setSecretSaga);
}
