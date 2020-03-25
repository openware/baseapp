// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../index';
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

        if (isFinexEnabled()) {
            yield call(API.post(ordersCancelOptions(getCsrfToken())), `/market/orders/cancel/${id}`, { id });
        } else {
            yield call(API.post(ordersCancelOptions(getCsrfToken())), `/market/orders/${id}/cancel`, { id });
        }

        yield put(alertPush({ message: ['success.order.cancelling'], type: 'success'}));
    } catch (error) {
        yield put(ordersHistoryCancelError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
