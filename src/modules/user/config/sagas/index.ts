import { takeLatest } from 'redux-saga/effects';
import { CONFIG_UPDATE } from '../constants';
import { configUpdateSaga } from './configUpdateSaga';

export function* rootConfigUpdateSaga() {
    yield takeLatest(CONFIG_UPDATE, configUpdateSaga);
}
