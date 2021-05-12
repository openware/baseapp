import { takeLatest } from 'redux-saga/effects';
import { CREATE_P2P_TRANSFERS_FETCH } from '../constants';
import { createP2PTransfersSaga } from './createP2PTransfersSaga';

export function* rootP2PTransfersSaga() {
    yield takeLatest(CREATE_P2P_TRANSFERS_FETCH, createP2PTransfersSaga);
}
