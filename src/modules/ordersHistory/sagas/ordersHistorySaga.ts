// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError } from '../..';
import { API, RequestOptions } from '../../../api';
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
        const { data, headers } = yield call(API.get(ordersOptions), `/market/orders?${params}`);

        yield put(userOrdersHistoryData({ list: data, pageIndex, total: headers.total }));
    } catch (error) {
        yield put(userOrdersHistoryError());
        yield put(fetchError(error));
    }
}
