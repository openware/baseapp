import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { DEPTH_FETCH, ORDER_BOOK_FETCH } from '../constants';
import { depthSaga } from './depthSaga';
import { orderBookSaga } from './orderBookSaga';

export function* rootOrderBookSaga(): SagaIterator {
    yield takeLatest(ORDER_BOOK_FETCH, orderBookSaga);
    yield takeLatest(DEPTH_FETCH, depthSaga);
}
