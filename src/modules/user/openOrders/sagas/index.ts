import { SagaIterator } from 'redux-saga';
import { takeEvery, takeLatest } from 'redux-saga/effects';

import { OPEN_ORDERS_CANCEL_FETCH, OPEN_ORDERS_FETCH } from '../constants';
import { openOrdersCancelSaga } from './openOrdersCancelSaga';
import { userOpenOrdersFetchSaga } from './userOpenOrdersFetchSaga';

export function* rootOpenOrdersSaga(): SagaIterator {
    yield takeLatest(OPEN_ORDERS_FETCH, userOpenOrdersFetchSaga);
    yield takeEvery(OPEN_ORDERS_CANCEL_FETCH, openOrdersCancelSaga);
}
