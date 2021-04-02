import { takeLatest } from 'redux-saga/effects';
import {
    P2P_TRADES_HISTORY_FETCH,
} from '../constants';
import { p2pTradesHistorySaga } from './p2pTradesHistorySaga';

export function* rootP2POrdersSaga() {
    yield takeLatest(P2P_TRADES_HISTORY_FETCH, p2pTradesHistorySaga);
}
