// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { OPEN_ORDERS_CANCEL_FETCH, OPEN_ORDERS_FETCH } from '../constants';
import { openOrdersCancelSaga } from './openOrdersCancelSaga';
import { userOpenOrdersFetchSaga } from './userOpenOrdersFetchSaga';


export function* rootOpenOrdersSaga() {
    yield takeLatest(OPEN_ORDERS_FETCH, userOpenOrdersFetchSaga);
    yield takeLatest(OPEN_ORDERS_CANCEL_FETCH, openOrdersCancelSaga);
}
