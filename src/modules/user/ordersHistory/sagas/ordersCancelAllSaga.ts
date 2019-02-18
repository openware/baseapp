// tslint:disable-next-line
import { call, put, select } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { fetchError, fetchSuccess } from '../../../index';
import {
    ordersCancelAllData,
    ordersCancelAllError,
    OrdersCancelAllFetch,
} from '../actions';
import { selectOrdersHistory } from '../selectors';

const ordersCancelAllOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* ordersCancelAllSaga(action: OrdersCancelAllFetch) {
    try {
        yield call(API.post(ordersCancelAllOptions), '/market/orders/cancel');
        const { tab } = action.payload;
        let list = [];
        if (tab === 'all') {
            const actualList = yield select(selectOrdersHistory);
            list = actualList.map(order => {
                if (order.state === 'wait') {
                    order.state = 'cancel';
                }
                return order;
            });
        }
        yield put(ordersCancelAllData(list));
        yield put(fetchSuccess('success.order.canceled.all'));
    } catch (error) {
        yield put(ordersCancelAllError());
        yield put(fetchError(error));
    }
}
