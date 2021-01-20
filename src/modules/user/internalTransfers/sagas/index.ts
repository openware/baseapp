import { takeLatest } from 'redux-saga/effects';
import { CREATE_INTERNAL_TRANSFERS_FETCH } from '../constants';
import { createInternalTransfersSaga } from './createInternalTransfersSaga';

export function* rootInternalTransfersSaga() {
    yield takeLatest(CREATE_INTERNAL_TRANSFERS_FETCH, createInternalTransfersSaga);
}
