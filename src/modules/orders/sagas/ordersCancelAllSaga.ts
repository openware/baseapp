// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { handleError } from '../../';
import { API, RequestOptions } from '../../../api';
import {
    OrdersCancelAllFetch,
} from '../actions';

const ordersCancelAllOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* ordersCancelAllSaga(action: OrdersCancelAllFetch) {
    try {
        yield call(API.post(ordersCancelAllOptions), `/market/orders/cancel`);
    } catch (error) {
        yield put(handleError(error.code));
    }
}
