// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { OrderCommon } from '../../../types';
import {
    ordersHistoryCancelData,
    ordersHistoryCancelError,
    OrdersHistoryCancelFetch,
} from '../actions';

const ordersCancelOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* ordersHistoryCancelSaga(action: OrdersHistoryCancelFetch) {
    try {
        const { id, type, list } = action.payload;
        yield call(API.post(ordersCancelOptions), `/market/orders/${id}/cancel`, { id });

        let updatedList: OrderCommon[] = [];
        if (type === 'all') {
            updatedList = list.map(order => {
                if (order.id === id) {
                    order.state = 'cancel';
                }
                return order;
            });
        } else {
            updatedList = list.filter(order => order.id !== id);
        }

        yield put(ordersHistoryCancelData(updatedList));
        yield put(alertPush({ message: ['success.order.canceled'], type: 'success'}));
    } catch (error) {
        yield put(ordersHistoryCancelError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
