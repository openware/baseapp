// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError, fetchSuccess } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    ordersCancelAllData,
    ordersCancelAllError,
    OrdersCancelAllFetch,
} from '../actions';

const ordersCancelAllOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* ordersCancelAllSaga(action: OrdersCancelAllFetch) {
    try {
        yield call(API.post(ordersCancelAllOptions), `/market/orders/cancel`);
        yield put(ordersCancelAllData());
        yield put(fetchSuccess('All orders were cenceled'));
    } catch (error) {
        yield put(ordersCancelAllError(error));
        yield put(fetchError(error));
    }
}
