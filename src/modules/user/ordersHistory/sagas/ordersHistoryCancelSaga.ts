// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import {
    ordersHistoryCancelError,
    OrdersHistoryCancelFetch,
} from '../actions';

const ordersCancelOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* ordersHistoryCancelSaga(action: OrdersHistoryCancelFetch) {
    try {
        const { id } = action.payload;
        const currentCsrfToken = yield getCsrfToken();
        yield call(API.post(ordersCancelOptions(currentCsrfToken)), `/market/orders/${id}/cancel`, { id });
        yield put(alertPush({ message: ['success.order.cancelling'], type: 'success'}));
    } catch (error) {
        yield put(ordersHistoryCancelError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
