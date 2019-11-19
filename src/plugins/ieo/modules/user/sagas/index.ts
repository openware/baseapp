// tslint:disable-next-line
import { takeEvery, takeLatest } from 'redux-saga/effects';
import {
    IEO_HISTORY_FETCH,
    IEO_ORDER_CANCEL_FETCH,
    IEO_ORDER_EXECUTE_FETCH,
    IEO_ORDERS_FETCH,
} from '../constants';
import { ieoHistorySaga } from './ieoHistorySaga';
import { ieoOrderCancelSaga } from './ieoOrderCancelSaga';
import { ieoOrderCreateSaga } from './ieoOrderCreateSaga';
import { ieoOrdersSaga } from './ieoOrdersSaga';

export function* rootIEOOrderSaga() {
    yield takeEvery(IEO_ORDERS_FETCH, ieoOrdersSaga);
    yield takeEvery(IEO_ORDER_CANCEL_FETCH, ieoOrderCancelSaga);
    yield takeEvery(IEO_ORDER_EXECUTE_FETCH, ieoOrderCreateSaga);
    yield takeLatest(IEO_HISTORY_FETCH, ieoHistorySaga);
}
