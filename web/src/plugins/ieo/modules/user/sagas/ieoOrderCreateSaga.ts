// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../../modules/public/alert';
import {
    ieoOrderExecuteData,
    ieoOrderExecuteError,
    OrderIEOExecuteFetch,
} from '../actions';

const ieoOrderOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* ieoOrderCreateSaga(action: OrderIEOExecuteFetch) {
    try {
        const order = yield call(API.post(ieoOrderOptions), '/private/ieo/orders', action.payload);
        yield put(ieoOrderExecuteData(order));
        yield put(alertPush({ message: ['success.order.created'], type: 'success'}));
    } catch (error) {
        yield put(ieoOrderExecuteError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
