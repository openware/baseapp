// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions, isFinexEnabled } from '../../../../api';
import { alertPush } from '../../../index';
import { userOpenOrdersAppend } from '../../openOrders';
import {
    orderExecuteData,
    orderExecuteError,
    OrderExecuteFetch,
} from '../actions';
import { getCsrfToken, getOrderAPI } from '../../../../helpers';

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

        if (order.ord_type !== 'market') {
            order.confirmed = isFinexEnabled() ? false : true;
            yield put(userOpenOrdersAppend(order));
        }

        if (order.confirmed) {
            yield put(alertPush({ message: ['success.order.created'], type: 'success'}));
        }
    } catch (error) {
        yield put(orderExecuteError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
