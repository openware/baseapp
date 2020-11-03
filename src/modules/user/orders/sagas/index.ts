import { SagaIterator } from 'redux-saga';
import { takeLatest } from 'redux-saga/effects';

import { ORDER_EXECUTE_FETCH } from '../constants';
import { ordersExecuteSaga } from './ordersExecuteSaga';

export function* rootOrdersSaga(): SagaIterator {
    yield takeLatest(ORDER_EXECUTE_FETCH, ordersExecuteSaga);
}
