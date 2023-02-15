import { takeLatest } from 'redux-saga/effects';
import {
    P2P_ORDERS_CREATE_FETCH,
    P2P_ORDERS_UPDATE_FETCH,
    P2P_ORDER_FETCH,
    P2P_TRADES_HISTORY_FETCH,
} from '../constants';
import { createOrderSaga } from './createOrderSaga';
import { getOrderSaga } from './getOrderSaga';
import { p2pTradesHistorySaga } from './p2pTradesHistorySaga';
import { updateOrderSaga } from './updateOrderSaga';

export function* rootP2POrdersSaga() {
    yield takeLatest(P2P_ORDERS_CREATE_FETCH, createOrderSaga);
    yield takeLatest(P2P_TRADES_HISTORY_FETCH, p2pTradesHistorySaga);
    yield takeLatest(P2P_ORDER_FETCH, getOrderSaga);
    yield takeLatest(P2P_ORDERS_UPDATE_FETCH, updateOrderSaga);
}
