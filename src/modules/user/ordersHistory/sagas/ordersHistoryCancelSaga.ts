import { call, put } from 'redux-saga/effects';
import { alertPush, sendError } from '../../../';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { getCsrfToken, getOrderAPI } from '../../../../helpers';
import { ordersHistoryCancelError, OrdersHistoryCancelFetch } from '../actions';

const ordersCancelOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: getOrderAPI(),
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
        yield put(sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: ordersHistoryCancelError,
            },
        }));
    }
}
