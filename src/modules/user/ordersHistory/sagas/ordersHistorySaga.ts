// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { convertOrderAPI } from '../../openOrders/helpers';
import {
    userOrdersHistoryData,
    userOrdersHistoryError,
    UserOrdersHistoryFetch,
} from '../actions';

const ordersOptions: RequestOptions = {
    apiVersion: 'peatio',
    withHeaders: true,
};

export function* ordersHistorySaga(action: UserOrdersHistoryFetch) {
    try {
        const { pageIndex, limit, type } = action.payload;
        const params = `limit=${limit}&page=${pageIndex + 1}${type === 'all' ? '' : '&state=wait'}`;
        const { data } = yield call(API.get(ordersOptions), `/market/orders?${params}`);

        const list = data.map(convertOrderAPI);

        yield put(userOrdersHistoryData({ list, pageIndex }));
    } catch (error) {
        yield put(userOrdersHistoryError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
