// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError, fetchSuccess } from '../../';
import { API, RequestOptions } from '../../../api';
import { openOrdersCancelData, openOrdersCancelError, OpenOrdersCancelFetch } from '../actions';


const ordersCancelOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* openOrdersCancelSaga(action: OpenOrdersCancelFetch) {
    try {
        const { id, list } = action.payload;
        yield call(API.post(ordersCancelOptions), `/market/orders/${id}/cancel`, { id });

        const updatedList = list.filter(order => order.id !== id);

        yield put(openOrdersCancelData(updatedList));
        yield put(fetchSuccess('Order was canceled'));
    } catch (error) {
        yield put(openOrdersCancelError());
        yield put(fetchError(error));
    }
}
