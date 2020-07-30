// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, isFinexEnabled, RequestOptions } from '../../../../api';
import { getCsrfToken, getOrderAPI } from '../../../../helpers';
import { alertPush } from '../../../index';
import { userOpenOrdersAppend } from '../../openOrders';
import {
    orderExecuteData,
    orderExecuteError,
    OrderExecuteFetch,
} from '../actions';

const executeOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: getOrderAPI(),
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* ordersExecuteSaga(action: OrderExecuteFetch) {
    try {
        const { market, side, volume, price, ord_type } = action.payload;
        const params = isFinexEnabled() ? {
            market: market,
            side: side,
            amount: volume,
            price: price,
            type: ord_type,
        } : action.payload;
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

        yield put(alertPush({ message: ['success.order.created'], type: 'success'}));
    } catch (error) {
        yield put(orderExecuteError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
