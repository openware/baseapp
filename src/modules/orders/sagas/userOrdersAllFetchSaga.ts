// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    userOrdersAllData,
    userOrdersAllError,
    UserOrdersAllFetch,
} from '../actions';
import { GroupedOrders, Order } from '../types';

const ordersOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* userOrdersAllFetchSaga(action: UserOrdersAllFetch) {
    try {
        const orders = yield call(API.get(ordersOptions), `/market/orders`);
        const groupedOrders: GroupedOrders = orders
            .reduce((grouped: GroupedOrders, order: Order) => ({
                ...grouped,
                [order.state]: [order, ...grouped[order.state]],
            }), {
                wait: [],
                cancel: [],
                done: [],
            });

        yield put(userOrdersAllData(groupedOrders));
    } catch (error) {
        yield put(userOrdersAllError(error));
        yield put(fetchError(error));
    }
}
