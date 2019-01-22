// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import {
    FEES_FETCH,
    ORDER_CANCEL_FETCH,
    ORDER_EXECUTE_FETCH,
    ORDERS_CANCEL_ALL_FETCH,
    USER_ORDERS_FETCH,
} from '../constants';
import { feesFetchSaga } from './feesFetchSaga';
import { ordersCancelAllSaga } from './ordersCancelAllSaga';
import { ordersCancelSaga } from './ordersCancelSaga';
import { ordersExecuteSaga } from './ordersExecuteSaga';
import { userOrdersFetchSaga } from './userOrdersFetchSaga';

export function* rootOrdersSaga() {
    yield takeLatest(USER_ORDERS_FETCH, userOrdersFetchSaga);
    yield takeLatest(ORDERS_CANCEL_ALL_FETCH, ordersCancelAllSaga);
    yield takeLatest(ORDER_CANCEL_FETCH, ordersCancelSaga);
    yield takeLatest(ORDER_EXECUTE_FETCH, ordersExecuteSaga);
    yield takeLatest(FEES_FETCH, feesFetchSaga);
    yield takeLatest(USER_ORDERS_FETCH, userOrdersFetchSaga);
}
