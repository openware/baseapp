// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import {
    ORDER_CANCEL_FETCH,
    ORDER_EXECUTE_FETCH,
    ORDERS_CANCEL_ALL_FETCH,
    USER_ORDERS_ALL_FETCH,
    USER_ORDERS_FETCH,
} from '../constants';
import { ordersCancelAllSaga } from './ordersCancelAllSaga';
import { ordersCancelSaga } from './ordersCancelSaga';
import { ordersExecuteSaga } from './ordersExecuteSaga';
import { userOrdersAllFetchSaga } from './userOrdersAllFetchSaga';
import { userOrdersFetchSaga } from './userOrdersFetchSaga';

export function* rootOrdersSaga() {
    yield takeLatest(ORDERS_CANCEL_ALL_FETCH, ordersCancelAllSaga);
    yield takeLatest(ORDER_CANCEL_FETCH, ordersCancelSaga);
    yield takeLatest(ORDER_EXECUTE_FETCH, ordersExecuteSaga);
    yield takeLatest(USER_ORDERS_ALL_FETCH, userOrdersAllFetchSaga);
    yield takeLatest(USER_ORDERS_FETCH, userOrdersFetchSaga);
}
