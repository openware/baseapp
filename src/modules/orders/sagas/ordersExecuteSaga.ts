// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { fetchError } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    orderExecuteData,
    orderExecuteError,
    OrderExecuteFetch,
} from '../actions';

const executeOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* ordersExecuteSaga(action: OrderExecuteFetch) {
    try {
        const order = yield call(API.post(executeOptions), '/market/orders', action.payload);
        yield put(orderExecuteData(order));
    } catch (error) {
        yield put(orderExecuteError(error));
        yield put(fetchError(error));
    }
}
