// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { USER_ORDERS_HISTORY_FETCH } from '../constants';
import { ordersHistorySaga } from './ordersHistorySaga';


export function* rootOrdersHistorySaga() {
    yield takeLatest(USER_ORDERS_HISTORY_FETCH, ordersHistorySaga);
}
