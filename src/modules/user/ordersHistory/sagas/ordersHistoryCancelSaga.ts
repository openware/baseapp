// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { fetchError, fetchSuccess } from '../../../public/alert';
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
        yield put(fetchSuccess('Order was canceled'));
    } catch (error) {
        yield put(ordersHistoryCancelError());
        yield put(fetchError(error));
    }
}
