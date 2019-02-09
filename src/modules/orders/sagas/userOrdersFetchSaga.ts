// tslint:disable-next-line
import { all, call, put } from 'redux-saga/effects';
import { fetchError } from '../../';
import { API, RequestOptions } from '../../../api';
import { Market } from '../../markets';
import {
    userOrdersData,
    userOrdersError,
    UserOrdersFetch,
} from '../actions';
import { GroupedOrders, Order } from '../types';

const ordersOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* userOrdersFetchSaga(action: UserOrdersFetch) {
    try {
        const createUrl = (market: Market) => `/market/orders?market=${market.id}&state=${action.payload.state}`;
        const requests = action.payload.market.map(
            (market: Market) => call(API.get(ordersOptions), createUrl(market)),
        );

        const orders = yield all(requests);
        console.log(orders)//tslint:disable-line
        const groupedOrders: GroupedOrders = orders
        // concat orders received by markets
        .reduce(
            (total: Order[][], marketOrders: Order[]) => total.concat(marketOrders),
            [],
        )
        .reduce((grouped: GroupedOrders, order: Order) => ({
            ...grouped,
            [order.state]: [order, ...grouped[order.state]],
        }), {
            wait: [],
            cancel: [],
            done: [],
        });

        yield put(userOrdersData(groupedOrders));
    } catch (error) {
        yield put(userOrdersError(error));
        yield put(fetchError(error));
    }
}
