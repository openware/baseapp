// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import {
    ordersCancelAllError,
    OrdersCancelAllFetch,
} from '../actions';

const ordersCancelAllOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* ordersCancelAllSaga(action: OrdersCancelAllFetch) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        yield call(API.post(ordersCancelAllOptions(currentCsrfToken)), '/market/orders/cancel', action.payload);
        yield put(alertPush({ message: ['success.order.cancelling.all'], type: 'success'}));
    } catch (error) {
        yield put(ordersCancelAllError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
