import { takeLatest } from 'redux-saga/effects';
import { P2P_DISPUTE_FETCH } from '../constants';
import { p2pDisputeSaga } from './createP2PDisputesSaga';

export function* rootP2PDisputeSaga() {
    yield takeLatest(P2P_DISPUTE_FETCH, p2pDisputeSaga);
}
