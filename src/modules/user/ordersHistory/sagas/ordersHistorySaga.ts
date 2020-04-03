// tslint:disable-next-line no-submodule-imports
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
};

export function* ordersHistorySaga(action: UserOrdersHistoryFetch) {
    try {
        const { pageIndex, limit, type } = action.payload;
        const params = `${type === 'all' ? '' : '&state=wait'}`;
        const data = yield call(API.get(ordersOptions), `/market/orders?page=${pageIndex + 1}&limit=${limit}${params}`);
        let nextPageExists = false;

        if (data.length === limit) {
            const checkData = yield call(API.get(ordersOptions), `/market/orders?page=${(pageIndex + 1) * limit + 1}&limit=${1}${params}`);

            if (checkData.length === 1) {
                nextPageExists = true;
            }
        }
        const list = data.map(convertOrderAPI);

        yield put(userOrdersHistoryData({ list, nextPageExists, pageIndex }));
    } catch (error) {
        yield put(userOrdersHistoryError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
