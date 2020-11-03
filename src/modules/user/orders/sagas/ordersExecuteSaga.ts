import { call, put } from 'redux-saga/effects';

import { alertPush, sendError } from '../../../';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { getCsrfToken, getOrderAPI } from '../../../../helpers';
import { userOpenOrdersAppend } from '../../openOrders';
import { orderExecuteData, orderExecuteError, OrderExecuteFetch } from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: getOrderAPI(),
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* ordersExecuteSaga(action: OrderExecuteFetch) {
    try {
        const { market, side, volume, price, ord_type } = action.payload;
        const params = isFinexEnabled()
            ? {
                  market: market,
                  side: side,
                  amount: volume,
                  price: price,
                  type: ord_type,
              }
            : action.payload;
        const order = yield call(API.post(executeOptions(getCsrfToken())), '/market/orders', params);
        yield put(orderExecuteData());

        if (getOrderAPI() === 'finex') {
            if (order.type !== 'market') {
                yield put(userOpenOrdersAppend(order));
            }
        } else {
            if (order.ord_type !== 'market') {
                yield put(userOpenOrdersAppend(order));
            }
        }

        yield put(alertPush({ message: ['success.order.created'], type: 'success' }));
    } catch (error) {
        yield put(
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: orderExecuteError,
                },
            })
        );
    }
}
