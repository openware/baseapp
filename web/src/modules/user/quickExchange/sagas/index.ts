import { takeLatest } from 'redux-saga/effects';
import { CREATE_QUICK_ORDER_FETCH } from '../constants';
import { createQuickExchangeOrderSaga } from './createQuickExchangeOrderSaga';

export function* rootQuickExchangeSaga() {
    yield takeLatest(CREATE_QUICK_ORDER_FETCH, createQuickExchangeOrderSaga);
}
