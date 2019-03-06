// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { userOpenOrdersAppend } from '../../openOrders';
import {
    orderExecuteData,
    orderExecuteError,
    OrderExecuteFetch,
} from '../actions';

const executeOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* ordersExecuteSaga(action: OrderExecuteFetch) {
    try {
        const order = yield call(API.post(executeOptions), '/market/orders', action.payload);
        yield put(orderExecuteData());
        if (order.ord_type !== 'market') {
            yield put(userOpenOrdersAppend(order));
        }
        yield put(alertPush({ message: ['success.order.created'], type: 'success'}));
    } catch (error) {
        yield put(orderExecuteError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
