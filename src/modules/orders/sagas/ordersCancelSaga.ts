// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError, fetchSuccess } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    orderCancelData,
    orderCancelError,
    OrderCancelFetch,
} from '../actions';

const ordersCancelOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* ordersCancelSaga(action: OrderCancelFetch) {
    try {
        const { id } = action.payload;
        yield call(API.post(ordersCancelOptions), `/market/orders/${id}/cancel`, action.payload);
        yield put(orderCancelData({ id }));
        yield put(fetchSuccess('Order was canceled'));
    } catch (error) {
        yield put(orderCancelError(error));
        yield put(fetchError(error));
    }
}
